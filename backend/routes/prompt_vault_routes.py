from flask import Blueprint, jsonify, current_app, g
from routes.auth import require_auth, _ADMIN_EMAILS
from firebase_admin import firestore
import json
import os

prompt_vault_bp = Blueprint('prompt_vault_routes', __name__)

@prompt_vault_bp.route('/api/prompt-vault/prompts', methods=['GET'])
@require_auth
def get_prompts():
    """
    Returns the premium prompts if the user has purchased the AI Prompt Vault or is an admin.
    """
    try:
        user_email = g.get('user_email', '').lower()
        uid = g.get('user_id', '')

        has_access = False

        # 1. Admin Bypass
        if user_email in _ADMIN_EMAILS:
            has_access = True
        
        # 2. Check User Subscription if not admin
        if not has_access and uid:
            db = firestore.client()
            user_doc = db.collection('users').document(uid).get()
            
            if user_doc.exists:
                user_data = user_doc.to_dict()
                if user_data.get('isPro', False) == True:
                    has_access = True

        if not has_access:
            return jsonify({'success': False, 'error': 'Unauthorized. Purchase required.'}), 403

        # Load prompts
        file_path = os.path.join(current_app.root_path, 'data', 'prompts.json')
        if not os.path.exists(file_path):
            return jsonify({'success': False, 'error': 'Prompts database not found'}), 404
            
        with open(file_path, 'r', encoding='utf-8') as f:
            prompts = json.load(f)
            
        return jsonify({'success': True, 'prompts': prompts})
    except Exception as e:
        print(f"Error fetching prompts: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
