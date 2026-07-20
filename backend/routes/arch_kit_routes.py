import os
import time
from flask import Blueprint, request, jsonify, g
from firebase_admin import firestore
from routes.auth import require_auth, _ADMIN_EMAILS
from google import genai
from google.genai import types
from flask_cors import CORS

arch_kit_bp = Blueprint('arch_kit', __name__)
CORS(arch_kit_bp, supports_credentials=True)

# Use Firestore for credits
try:
    db = firestore.client()
except Exception:
    db = None

# In-memory simple rate limiting for Arch Kit
rate_limit_cache = {}

def is_rate_limited(ip, limit=10, window_sec=3600):
    now = time.time()
    if ip not in rate_limit_cache:
        rate_limit_cache[ip] = []
    
    # Filter out old requests
    rate_limit_cache[ip] = [req_time for req_time in rate_limit_cache[ip] if now - req_time < window_sec]
    
    if len(rate_limit_cache[ip]) >= limit:
        return True
        
    rate_limit_cache[ip].append(now)
    return False

@arch_kit_bp.route('/generate', methods=['POST'])
@require_auth
def generate_architecture():
    uid = g.user_id
    user_email = g.get('user_email', '').lower()
    is_admin = user_email in _ADMIN_EMAILS

    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if client_ip:
        client_ip = client_ip.split(',')[0].strip()
    
    # Rate limit: 10 per hour per IP
    if is_rate_limited(client_ip, limit=10, window_sec=3600):
        return jsonify({"error": "Rate limit exceeded. Try again later."}), 429
        
    data = request.get_json()
    description = data.get('description', '')
    
    if not description or len(description) < 5:
        return jsonify({"error": "Description is too short."}), 400
        
    if len(description) > 3000:
        return jsonify({"error": "Description is too long (max 3000 chars)."}), 400

    if not db:
        return jsonify({"error": "Database not connected."}), 500

    user_ref = db.collection('users').document(uid)
    cost = 15
    
    # Check credits without transaction first (fast fail)
    user_doc = user_ref.get()
    current_credits = user_doc.to_dict().get('vault_credits', 0) if user_doc.exists else 0
    
    if not is_admin and current_credits < cost:
        return jsonify({"error": "Insufficient Vault Credits (Requires 15). Please upgrade."}), 402
        
    # Deduct credit (only if not admin)
    if not is_admin:
        try:
            user_ref.update({'vault_credits': firestore.Increment(-cost)})
        except Exception as e:
            print(f"[ERROR] Arch Kit credit deduction failed for {uid}: {e}")
            return jsonify({"error": "Failed to process credit deduction."}), 500
        
    # Generate Mermaid diagram using Gemini
    try:
        api_key = os.environ.get("GEMINI_API_KEY2")
        if not api_key:
            raise ValueError("Gemini API key missing")
            
        client = genai.Client(api_key=api_key)
        
        system_instruction = """
You are an expert software architect. You take a plain English description of a system architecture and output ONLY raw valid Mermaid.js code for a graph (flowchart).
DO NOT wrap the output in markdown code blocks like ```mermaid.
DO NOT include any explanations, greetings, or other text.
Use 'flowchart TD' (top down) or 'flowchart LR' (left right) depending on what looks best.

CRITICAL REQUIREMENTS FOR ENTERPRISE DIAGRAMS:
1. NETWORK BOUNDARIES (Subgraphs):
   ALWAYS group related components inside descriptive subgraphs to represent network boundaries, tiers, or VPCs.
   Example:
   subgraph Public_Layer ["🌐 API Gateway / Public"]
     API[fa:fa-cloud API Gateway]
   end

2. STANDARDIZED ICONS:
   ALWAYS use FontAwesome icons in node labels.
   Example node format: NodeID[fa:fa-server Node Label]
   Useful icons: fa:fa-server (backend), fa:fa-database (db), fa:fa-cloud (AWS/API), fa:fa-user (client/user), fa:fa-mobile (mobile app), fa:fa-desktop (web app), fa:fa-envelope (SNS/email), fa:fa-lock (auth), fa:fa-layer-group (cache), fa:fa-cube (microservice).

3. MODERN STYLING:
   - Define a classDef for components, e.g. classDef default fill:#1e293b,stroke:#334155,stroke-width:2px,color:#f8fafc;
   - Provide clean connections.
ONLY return the exact mermaid code string.
"""
        
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=description,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
            )
        )
        
        mermaid_code = response.text.strip()
        
        # Strip potential markdown blocks if Gemini stubbornly includes them
        if mermaid_code.startswith("```mermaid"):
            mermaid_code = mermaid_code[len("```mermaid"):].strip()
        if mermaid_code.startswith("```"):
            mermaid_code = mermaid_code[3:].strip()
        if mermaid_code.endswith("```"):
            mermaid_code = mermaid_code[:-3].strip()
            
        return jsonify({
            "success": True,
            "mermaid_code": mermaid_code,
            "credits_deducted": cost
        })
        
    except Exception as e:
        print(f"[ERROR] Arch Kit generation failed: {e}")
        # Refund on backend generation failure
        try:
            user_ref.update({'vault_credits': firestore.Increment(cost)})
        except Exception as refund_err:
            print(f"[CRITICAL] Arch Kit refund failed for {uid}: {refund_err}")
            
        return jsonify({"error": "Failed to generate diagram. Credits refunded.", "details": str(e)}), 500


@arch_kit_bp.route('/refund', methods=['POST'])
@require_auth
def refund_credits():
    uid = g.user_id
    user_email = g.get('user_email', '').lower()
    is_admin = user_email in _ADMIN_EMAILS
    
    # This endpoint is called if the frontend fails to parse the Mermaid code.
    if not db:
        return jsonify({"error": "Database not connected."}), 500

    user_ref = db.collection('users').document(uid)
    cost = 15
    
    # Admins are not charged, so no refund needed
    if is_admin:
        return jsonify({"success": True, "message": "Admin user, no refund necessary."})

    data = request.get_json()
    reason = data.get('reason', 'parse_error')
    
    print(f"[INFO] Processing Arch Kit refund for {uid}. Reason: {reason}")
    
    try:
        user_ref.update({'vault_credits': firestore.Increment(cost)})
        return jsonify({"success": True, "message": "Credits refunded."})
    except Exception as e:
        print(f"[CRITICAL] Failed to process explicit refund for {uid}: {e}")
        return jsonify({"error": "Failed to refund."}), 500
