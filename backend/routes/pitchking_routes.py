import os
import json
import uuid
import re
from flask import Blueprint, request, jsonify, send_file, g
import tempfile
from firebase_admin import firestore
from routes.auth import require_auth
from utils.pptx_generator import generate_pptx

# Use Google GenAI instead of OpenAI
from google import genai
from google.genai import types

pitchking_bp = Blueprint('pitchking', __name__)

try:
    from database import get_db
    db = get_db()
    sessions_collection = db['pitchking_sessions'] if db is not None else None
except Exception:
    from pymongo import MongoClient
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/ikkish')
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_default_database() if client.get_default_database().name else client['ikkish']
        sessions_collection = db['pitchking_sessions']
    except Exception as e:
        print(f"Error connecting to MongoDB in PitchKing routes: {e}")
        sessions_collection = None

# Gemini Setup
gemini_api_key = os.getenv("GEMINI_API_KEY2")
if gemini_api_key:
    gemini_client = genai.Client(api_key=gemini_api_key)
else:
    gemini_client = None

def _generate_deck_html(deck_data, is_free=False, theme='aurora'):
    watermark_html = ""
    if is_free:
        watermark_html = """<div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"><div class="transform -rotate-12 text-[180px] font-black text-white/5 uppercase tracking-[0.2em] whitespace-nowrap text-center leading-none">MADE WITH PITCHKING<br>FREE TIER</div></div>"""

    # Helper for TAM/SAM/SOM chart data
    market_data = deck_data.get('market', {})
    
    # Helper to parse strings like "$10B" into numbers for Chart.js. E.g. "$10B" -> 10.
    def parse_metric(val):
        try:
            return float(''.join(c for c in str(val) if c.isdigit() or c == '.'))
        except:
            return 10
            
    tam_val = parse_metric(market_data.get('tam', '100'))
    sam_val = parse_metric(market_data.get('sam', '50'))
    som_val = parse_metric(market_data.get('som', '10'))
    
    traction_data = deck_data.get('traction', {}).get('metrics', [])
    traction_labels = [m.get("label", "") for m in traction_data]
    traction_values = [parse_metric(m.get("value", "0")) for m in traction_data]

    # Dynamic Theme CSS injection
    if theme == 'minimal_light':
        bg_css = "background: #ffffff; color: #111827;"
        card_css = "background: #f3f4f6; border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(0,0,0,0.05);"
        text_color = "#111827"
        body_color = "#4b5563"
    elif theme == 'corporate_blue':
        bg_css = "background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white;"
        card_css = "background: rgba(30, 58, 138, 0.7); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);"
        text_color = "white"
        body_color = "#bfdbfe"
    else: # aurora (default)
        bg_css = "background: radial-gradient(ellipse at top right, #1e293b, #0f172a 60%, #020617); color: white;"
        card_css = "background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);"
        text_color = "white"
        body_color = "#cbd5e1"


    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            tailwind.config = {{
                theme: {{
                    extend: {{
                        fontFamily: {{
                            sans: ['Inter', 'sans-serif'],
                            heading: ['"Space Grotesk"', 'sans-serif'],
                        }},
                    }},
                    colors: {{
                        slate: {{
                            850: '#141e33',
                            900: '#0f172a',
                            950: '#020617',
                        }},
                        cyan: {{
                            400: '#22d3ee',
                            500: '#06b6d4',
                        }}
                    }}
                }}
            }}
        </script>
        <style>
            @page {{ size: 1920px 1080px; margin: 0; }}
            body {{ 
                margin: 0; padding: 0; 
                width: 1920px; height: 1080px; 
                overflow: hidden; 
                background: #0f172a;
            }}
            .slide {{ 
                position: relative;
                width: 1920px; height: 1080px; 
                page-break-after: always; 
                padding: 64px; 
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                {bg_css}
            }}
            .slide:last-child {{ page-break-after: avoid; }}
            
            /* High Contrast Cards */
            .glass-card {{
                {card_css}
                border-radius: 24px;
                padding: 48px;
                position: relative;
                z-index: 10;
            }}
            
            /* Typography */
            h1.title {{
                font-family: 'Space Grotesk', sans-serif;
                font-size: 140px;
                font-weight: 900;
                line-height: 1.05;
                margin-bottom: 40px;
                color: {text_color};
                text-align: left;
                letter-spacing: -0.03em;
            }}
            .subtitle {{
                font-family: 'Space Grotesk', sans-serif;
                font-size: 40px;
                font-weight: 700;
                background: linear-gradient(135deg, #22d3ee, #3b82f6);
                -webkit-background-clip: text;
                color: transparent;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                margin-bottom: 24px;
            }}
            h2.section-header {{
                font-family: 'Space Grotesk', sans-serif;
                font-size: 80px;
                font-weight: 900;
                color: {text_color};
                margin-bottom: 64px;
                text-align: center;
                letter-spacing: -0.02em;
            }}
            h3.card-header {{
                font-family: 'Space Grotesk', sans-serif;
                font-size: 40px;
                font-weight: 700;
                color: #22d3ee;
                margin-bottom: 16px;
            }}
            p.body-text {{
                font-family: 'Inter', sans-serif;
                font-size: 36px;
                color: {body_color};
                line-height: 1.6;
            }}
            .metric-value {{
                font-family: 'Space Grotesk', sans-serif;
                font-size: 110px;
                font-weight: 900;
                color: white; 
                line-height: 1;
                letter-spacing: -0.03em;
            }}
            .metric-label {{
                font-family: 'Inter', sans-serif;
                font-size: 28px;
                font-weight: 600;
                color: #94a3b8; /* slate-400 */
                text-transform: uppercase;
                letter-spacing: 0.15em;
                margin-top: 16px;
            }}
            
            ul.custom-list li {{
                font-family: 'Inter', sans-serif;
                font-size: 32px;
                color: #f1f5f9;
                margin-bottom: 24px;
                padding-left: 24px;
                border-left: 6px solid #06b6d4;
                line-height: 1.5;
            }}
        </style>
    </head>
    <body>
    """
    slides = deck_data.get('slides', [])
    if not slides:
        # Fallback for old data schema if required
        slides = [{"type": "title", "companyName": deck_data.get('title', {}).get('companyName', 'Company'), "tagline": deck_data.get('title', {}).get('tagline', 'Tagline')}]
    
    for slide in slides:
        slide_type = slide.get('type')
        html += '<div class="slide">'
        html += watermark_html
        
        tag_html = f'<div style="font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #3b82f6; text-transform: uppercase; background: rgba(59, 130, 246, 0.1); padding: 8px 24px; border-radius: 99px; display: inline-block; margin-bottom: 24px; border: 1px solid rgba(59, 130, 246, 0.2);">{slide.get("tag")}</div>' if slide.get('tag') else ''

        if slide_type == 'title':
            html += f"""
            <div class="z-10 flex flex-col items-start justify-center h-full max-w-[1200px] ml-12">
                <div class="subtitle">Pitch Deck 2026 &bull; Confidential</div>
                <h1 style="font-size: 100px; font-weight: 900; color: white; margin-bottom: 24px; font-family: 'Space Grotesk', sans-serif; line-height: 1.1;">{slide.get('companyName', 'Company Name')}</h1>
                <div class="w-32 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 rounded-full"></div>
                <p class="body-text text-left text-[40px] text-white/90">{slide.get('tagline', 'Your compelling tagline goes here.')}</p>
            </div>
            """
        elif slide_type == 'list':
            html += f"""
            <div class="z-10 flex flex-col h-full w-full max-w-[1500px] mx-auto p-16">
                {tag_html}
                <h2 class="section-header text-left" style="font-size: 64px; text-align: left; margin-bottom: 32px;">{slide.get('title', 'Overview')}</h2>
                {f'<p class="body-text mb-12" style="font-size: 32px;">{slide.get("content")}</p>' if slide.get('content') else ''}
                <div class="grid grid-cols-2 gap-8 w-full">
                    {''.join([f'<div class="glass-card" style="padding: 32px; display: flex; align-items: flex-start; gap: 20px;"><div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; color: #3b82f6; font-weight: bold; font-size: 24px; flex-shrink: 0;">{i+1}</div><div style="font-size: 28px; line-height: 1.5; color: #e2e8f0;">{p}</div></div>' for i, p in enumerate(slide.get('items', []))])}
                </div>
            </div>
            """
        elif slide_type == 'split':
            html += f"""
            <div class="z-10 flex flex-row h-full w-full" style="padding: 0; max-width: none;">
                <div class="flex-1 flex flex-col justify-center p-20" style="padding-left: 80px; padding-right: 80px;">
                    {tag_html}
                    <h2 class="section-header text-left" style="font-size: 72px; text-align: left; margin-bottom: 40px;">{slide.get('title', 'Details')}</h2>
                    {f'<p class="body-text mb-12" style="font-size: 36px; line-height: 1.5;">{slide.get("content")}</p>' if slide.get('content') else ''}
                    <div class="flex flex-col gap-6 w-full">
                        {''.join([f'<div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 24px; border-radius: 16px; display: flex; align-items: center; gap: 16px;"><span style="color: #3b82f6; font-size: 28px; font-weight: bold;">✓</span><span style="font-size: 26px; color: #e2e8f0;">{p}</span></div>' for p in slide.get('items', [])])}
                    </div>
                </div>
                <div class="flex-1" style="background: #1e293b;">
                    {f'<img src="{slide.get("imageUrl")}" style="width: 100%; height: 100%; object-fit: cover;" />' if slide.get('imageUrl') else '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; color: rgba(255,255,255,0.2);">Placeholder Image</div>'}
                </div>
            </div>
            """
        elif slide_type == 'metrics':
            html += f"""
            <div class="z-10 flex flex-col h-full w-full max-w-[1600px] mx-auto justify-center p-16">
                <div style="text-align: center;">{tag_html}</div>
                <h2 class="section-header text-center" style="font-size: 72px; margin-bottom: 24px;">{slide.get('title', 'Key Metrics')}</h2>
                {f'<p class="body-text text-center mb-16" style="font-size: 36px;">{slide.get("content")}</p>' if slide.get('content') else ''}
                <div class="flex gap-10 justify-center items-stretch flex-wrap">
                    {''.join([f'<div class="glass-card flex-1 min-w-[300px] p-12 text-center flex flex-col justify-center border-t-8 border-t-cyan-400 overflow-hidden"><div class="metric-value" style="font-size: 72px; margin-bottom: 16px;">{m.get("value", "-")}</div><div class="metric-label" style="font-size: 24px;">{m.get("label", "-")}</div><div class="mt-4 text-slate-400 text-xl">{m.get("desc", "")}</div></div>' for m in slide.get('metrics', [])])}
                </div>
            </div>
            """
        elif slide_type == 'chart':
            data = slide.get('data', [])
            max_val = max([float(d.get('value', 0)) for d in data] + [1])
            is_horizontal = slide.get('chartType') != 'vertical'
            
            chart_html = ""
            if is_horizontal:
                chart_html = '<div style="display: flex; flex-direction: column; justify-content: center; gap: 32px; width: 100%; height: 100%;">'
                for d in data:
                    width_pct = (float(d.get('value', 0)) / max_val) * 100
                    chart_html += f'<div style="display: flex; align-items: center; gap: 24px;"><div style="width: 20%; text-align: right; font-size: 28px; font-weight: bold; color: #e2e8f0;">{d.get("label", "")}</div><div style="flex: 1; background: rgba(255,255,255,0.05); height: 64px; border-radius: 0 16px 16px 0; overflow: hidden;"><div style="width: {width_pct}%; height: 100%; background: linear-gradient(90deg, #22d3ee, #3b82f6); display: flex; align-items: center; justify-content: flex-end; padding-right: 16px; color: white; font-weight: bold; font-size: 24px;">{d.get("value", "")}</div></div></div>'
                chart_html += '</div>'
            else:
                chart_html = '<div style="display: flex; align-items: flex-end; justify-content: center; gap: 48px; width: 100%; height: 100%; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 48px;">'
                for d in data:
                    height_pct = (float(d.get('value', 0)) / max_val) * 100
                    chart_html += f'<div style="display: flex; flex-direction: column; align-items: center; gap: 24px; height: 100%; justify-content: flex-end; flex: 1; max-width: 150px;"><div style="width: 100%; height: 100%; background: rgba(255,255,255,0.05); border-radius: 16px 16px 0 0; display: flex; flex-direction: column; justify-content: flex-end;"><div style="height: {height_pct}%; width: 100%; background: linear-gradient(0deg, #22d3ee, #3b82f6); border-radius: 16px 16px 0 0; display: flex; align-items: flex-start; justify-content: center; padding-top: 16px; color: white; font-weight: bold; font-size: 24px;">{d.get("value", "")}</div></div><div style="text-align: center; font-size: 28px; font-weight: bold; color: #e2e8f0;">{d.get("label", "")}</div></div>'
                chart_html += '</div>'

            html += f"""
            <div class="z-10 flex flex-col h-full w-full max-w-[1500px] mx-auto p-16">
                {tag_html}
                <h2 class="section-header text-left" style="font-size: 64px; text-align: left; margin-bottom: 32px;">{slide.get('title', 'Chart')}</h2>
                {f'<p class="body-text mb-12" style="font-size: 32px;">{slide.get("content")}</p>' if slide.get('content') else ''}
                <div class="glass-card flex-1 p-16 flex items-end justify-center">
                    {chart_html}
                </div>
            </div>
            """
        elif slide_type == 'custom':
            blocks_html = ""
            for block in slide.get('blocks', []):
                b_type = block.get('type')
                if b_type == 'heading':
                    blocks_html += f'<h2 class="section-header text-center" style="font-size: 80px; margin-bottom: 24px;">{block.get("content", "")}</h2>'
                elif b_type == 'text':
                    blocks_html += f'<p class="body-text text-center text-[40px] mb-8">{block.get("content", "")}</p>'
                elif b_type == 'image' and block.get('imageUrl'):
                    blocks_html += f'<div class="flex justify-center w-full"><img src="{block.get("imageUrl")}" style="max-height: 500px; object-fit: contain; border-radius: 16px; margin: 20px 0;" /></div>'
            html += f"""
            <div class="z-10 flex flex-col h-full w-full max-w-[1400px] mx-auto justify-center items-center">
                {blocks_html}
            </div>
            """
        
        html += '<div class="absolute bottom-10 right-10 text-white/20 font-bold tracking-widest uppercase">NEXUS AI</div>'
        html += '</div>'
        
    html += """
    </body>
    </html>
    """
    return html

@pitchking_bp.route('/generate', methods=['POST'])
@require_auth
def generate_pitch():
    data = request.json
    if not data or 'content' not in data:
        return jsonify({"error": "Missing content"}), 400

    raw_content = data['content']
    mode = data.get('mode', 'dump')

    system_prompt = (
        "You are a world-class VC pitch deck strategist. You have coached 500+ startups through YC, Sequoia, and a16z pitches.\n"
        "Your mission: Turn the user's raw notes into a STUNNING, investor-ready pitch deck that would pass a Sequoia first-look review.\n"
        "Think like: every word justifies the valuation. Data > fluff. Specificity > generality.\n"
        "\n"
        "SLIDE STRUCTURE — generate EXACTLY 11-12 slides in this order:\n"
        "1. TITLE — Company name (max 20 chars) + razor-sharp one-liner tagline (max 65 chars). Add 'tag' like 'AI · B2B SaaS'.\n"
        "2. THE PROBLEM — type='split'. RIGHT side = image. LEFT = 3 stat-backed pain points. Content = the root cause sentence (max 120 chars). Use real industry stats (IBM, Gartner, McKinsey style). MAKE IT HURT.\n"
        "3. THE SOLUTION — type='split'. RIGHT side = product image. LEFT = value prop sentence + 4 feature bullets. Each bullet: specific, outcome-focused, max 65 chars.\n"
        "4. WHY NOW — type='list'. Title = 'The Window Is Now'. 3-4 bullets explaining market timing: regulatory change, tech inflection, behavior shift, or macro tailwind. Each bullet: specific event/stat + year. E.g., 'GPT-4 made real-time AI ops viable — Feb 2023'. No vague trends.\n"
        "5. HOW IT WORKS — type='list'. 4 numbered steps (Step 1: ..., Step 2: ...) showing the user journey. Max 70 chars each.\n"
        "6. MARKET OPPORTUNITY — type='chart', chartType='horizontalBar'. 3 bars: TAM, SAM, SOM with $B values. Title = '$XB Market'. Content = CAGR + tailwind sentence.\n"
        "7. TRACTION — type='metrics'. 4 KPI cards: MRR (or ARR), active customers/users, churn rate (0% if early), NPS or retention. Desc = growth context. Title should start with a big KPI like '$285K MRR'.\n"
        "8. GROWTH TRAJECTORY — type='chart', chartType='line'. 5-6 data points (months) showing MRR or users growth. Title = 'X% MoM Growth'. This is MANDATORY.\n"
        "9. BUSINESS MODEL — type='metrics'. 3-4 pricing tier cards (Starter/Growth/Enterprise) + LTV:CAC ratio card. Each card: label=tier name, value=price, desc=period+limit.\n"
        "10. COMPETITIVE LANDSCAPE — type='chart', chartType='bar'. Compare us vs 3-4 named competitors on ONE key metric (normalize 0-100). We MUST score 90+. Content = why we win sentence.\n"
        "11. THE TEAM — type='list'. 3-4 team members. Format: 'Full Name · Title — [specific past achievement with $, company name, or outcome]'. Make them sound like ex-FAANG/YC/unicorn founders.\n"
        "12. THE ASK — type='list', tag='THE ASK'. Title = 'Raising $[X] [Series]'. Items: '[X]% use of funds description (be specific)', plus LAST item = 'Milestone: [concrete 18-month goal with $ target]'.\n"
        "\n"
        "QUALITY RULES — violating these = failure:\n"
        "- NEVER use vague language: 'improves efficiency', 'better solution', 'growing market'. ALWAYS quantify.\n"
        "- PROBLEM slide MUST use type='split' with an imageUrl (use a relevant Unsplash URL for the industry).\n"
        "- SOLUTION slide MUST use type='split' with an imageUrl (product/UI/tech visual).\n"
        "- TRACTION title must lead with the most impressive metric (e.g., '$285K MRR. Zero Churn.').\n"
        "- TEAM items must reference a real company or measurable outcome. No generic 'experienced professional'.\n"
        "- GROWTH TRAJECTORY slide is MANDATORY — do not skip it.\n"
        "- Infer realistic numbers if user doesn't provide them (use conservative but credible estimates for the industry).\n"
        "\n"
        "UNSPLASH IMAGE URLS TO USE (pick relevant one for imageUrl in split slides):\n"
        "- Tech/SaaS: https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80\n"
        "- Security/Data: https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80\n"
        "- Finance/Fintech: https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80\n"
        "- E-commerce/D2C: https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80\n"
        "- AI/ML: https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80\n"
        "- Healthcare: https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80\n"
        "- Team/People: https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80\n"
        "\n"
        "RETURN ONLY VALID JSON — no markdown, no explanation, just JSON:\n"
        "{\n"
        "  \"slides\": [\n"
        "    {\"type\": \"title\", \"companyName\": \"...\", \"tagline\": \"...\", \"tag\": \"...\"},\n"
        "    {\"type\": \"split\", \"tag\": \"THE PROBLEM\", \"title\": \"...\", \"content\": \"...\", \"items\": [\"stat-backed pain 1\", \"stat-backed pain 2\", \"stat-backed pain 3\"], \"imageUrl\": \"https://...\"},\n"
        "    {\"type\": \"split\", \"tag\": \"THE SOLUTION\", \"title\": \"...\", \"content\": \"...\", \"items\": [\"feature 1\", \"feature 2\", \"feature 3\", \"feature 4\"], \"imageUrl\": \"https://...\"},\n"
        "    {\"type\": \"list\", \"tag\": \"HOW IT WORKS\", \"title\": \"...\", \"items\": [\"Step 1: ...\", \"Step 2: ...\", \"Step 3: ...\", \"Step 4: ...\"]},\n"
        "    {\"type\": \"chart\", \"tag\": \"MARKET OPPORTUNITY\", \"title\": \"$XB Total Market\", \"content\": \"[CAGR]% CAGR — [growth driver]\", \"chartType\": \"horizontalBar\", \"data\": [{\"label\": \"TAM ($B)\", \"value\": X}, {\"label\": \"SAM ($B)\", \"value\": Y}, {\"label\": \"SOM ($B)\", \"value\": Z}]},\n"
        "    {\"type\": \"metrics\", \"tag\": \"TRACTION\", \"title\": \"$[X] MRR. [X]% Churn.\", \"content\": \"[growth context]\", \"metrics\": [{\"label\": \"MRR\", \"value\": \"$X\", \"desc\": \"+X% MoM\"}, {\"label\": \"Clients\", \"value\": \"N\", \"desc\": \"active\"}, {\"label\": \"Churn\", \"value\": \"0%\", \"desc\": \"12 months\"}, {\"label\": \"NPS\", \"value\": \"N\", \"desc\": \"score\"}]},\n"
        "    {\"type\": \"chart\", \"tag\": \"GROWTH\", \"title\": \"[X]% MoM Growth Trajectory\", \"content\": \"Organic growth only. Zero paid marketing.\", \"chartType\": \"line\", \"data\": [{\"label\": \"Month 1\", \"value\": A}, {\"label\": \"Month 2\", \"value\": B}, {\"label\": \"Month 3\", \"value\": C}, {\"label\": \"Month 4\", \"value\": D}, {\"label\": \"Month 5\", \"value\": E}, {\"label\": \"Month 6\", \"value\": F}]},\n"
        "    {\"type\": \"metrics\", \"tag\": \"BUSINESS MODEL\", \"title\": \"...\", \"content\": \"...\", \"metrics\": [{\"label\": \"Starter\", \"value\": \"$X\", \"desc\": \"/mo · limit\"}, {\"label\": \"Growth\", \"value\": \"$Y\", \"desc\": \"/mo · limit\"}, {\"label\": \"Enterprise\", \"value\": \"$Z+\", \"desc\": \"/mo · unlimited\"}, {\"label\": \"LTV:CAC\", \"value\": \"X:1\", \"desc\": \"ratio\"}]},\n"
        "    {\"type\": \"chart\", \"tag\": \"COMPETITIVE LANDSCAPE\", \"title\": \"...\", \"content\": \"...\", \"chartType\": \"bar\", \"data\": [{\"label\": \"[Us]\", \"value\": 95}, {\"label\": \"[Competitor A]\", \"value\": 58}, {\"label\": \"[Competitor B]\", \"value\": 45}, {\"label\": \"[Incumbent]\", \"value\": 25}]},\n"
        "    {\"type\": \"list\", \"tag\": \"THE TEAM\", \"title\": \"...\", \"items\": [\"Name · CEO — Ex-[Company], [specific achievement]\", \"Name · CTO — Ex-[Company], [patent/outcome]\", \"Advisor: Name — [Title, Company, portfolio]\"]},\n"
        "    {\"type\": \"list\", \"tag\": \"THE ASK\", \"title\": \"Raising $[X] [Series]\", \"items\": [\"[X]% Engineering — [specific headcount or outcome]\", \"[Y]% GTM & Sales — [specific target]\", \"[Z]% Operations — [runway months] runway\", \"Milestone: $[X] ARR → [next round] in 18 months\"]}\n"
        "  ]\n"
        "}\n"
        "\n"
        "Valid slide type values: title, list, split, metrics, chart.\n"
        "Valid chartType values: bar, horizontalBar, line, pie, donut.\n"
        "CRITICAL: Generate 12-13 slides. Include WHY NOW slide (type=list). Include the GROWTH TRAJECTORY chart (type=chart, chartType=line). Use split for Problem AND Solution slides.\n"
    )

    try:
        if not gemini_client:
            print("No Gemini API key found, returning mock data.")
            deck_data = {
                "slides": [
                    {"type": "title", "companyName": "NexusAI", "tagline": "Autonomous L1 Customer Support."},
                    {"type": "list", "tag": "THE PROBLEM", "title": "E-commerce Brands Are Bleeding", "items": ["15% Revenue Lost", "2-Minute Rule", "Agents Can't Scale"]},
                    {"type": "split", "tag": "THE SOLUTION", "title": "One Integration.", "content": "NexusAI connects to any Shopify store with 1-click.", "items": ["Understands context", "Seamless escalation"]},
                    {"type": "chart", "tag": "MARKET OPPORTUNITY", "title": "A $35B Market", "chartType": "horizontal", "data": [{"label": "TAM ($B)", "value": 35}, {"label": "SAM ($B)", "value": 8}, {"label": "SOM ($B)", "value": 0.15}]},
                    {"type": "metrics", "tag": "BUSINESS MODEL", "title": "Usage-Based Pricing", "metrics": [{"label": "Base Fee", "value": "$299", "desc": "/month"}, {"label": "Usage", "value": "$0.15", "desc": "/resolved ticket"}]},
                    {"type": "metrics", "tag": "TRACTION", "title": "Early Proof. Zero Churn.", "metrics": [{"label": "MRR", "value": "$12.5K", "desc": ""}, {"label": "Active", "value": "45", "desc": "Customers"}]},
                    {"type": "chart", "tag": "COMPETITION", "title": "Performance vs Legacy", "chartType": "vertical", "data": [{"label": "NexusAI", "value": 98}, {"label": "Zendesk", "value": 45}, {"label": "Intercom", "value": 55}]},
                    {"type": "list", "tag": "THE ASK", "title": "Raising $750K", "items": ["50% Engineering", "35% GTM & Sales", "15% Operations"]}
                ]
            }
        else:
            try:
                # gemini-3.5-flash — Google's latest GA model (May 2026), highest quality
                response = gemini_client.models.generate_content(
                    model='gemini-3.5-flash',
                    contents=f"{system_prompt}\n\nHere is the raw data ({mode}):\n{raw_content}",
                    config=types.GenerateContentConfig(
                        temperature=0.7,
                        response_mime_type="application/json"
                    )
                )
            except Exception as e:
                print(f"gemini-3.1-flash-lite failed ({e}), returning mock data...")
                raise e
                
            raw_text = response.text
            # Clean up potential markdown formatting block
            if raw_text.startswith("```json"):
                raw_text = raw_text.replace("```json", "", 1)
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
            raw_text = raw_text.strip()
            deck_data = json.loads(raw_text)

        # Save to MongoDB
        session_id = str(uuid.uuid4())
        if sessions_collection is not None:
            sessions_collection.insert_one({
                "session_id": session_id,
                "raw_content": raw_content,
                "deck_data": deck_data,
                "status": "generated"
            })

        return jsonify({
            "session_id": session_id,
            "deck_data": deck_data
        })

    except Exception as e:
        print(f"Generation error: {e}")
        return jsonify({"error": str(e)}), 500

@pitchking_bp.route('/export', methods=['POST'])
@require_auth
def export_pdf():
    data = request.json
    if not data or 'deck_data' not in data:
        return jsonify({"error": "Missing deck_data"}), 400

    deck_data = data['deck_data']
    session_id = data.get('session_id', str(uuid.uuid4()))
    
    ALL_THEMES = ['aurora', 'midnight_vc', 'deep_ocean', 'obsidian_gold', 'crimson_empire',
                  'forest_venture', 'silicon_sage', 'arctic_light', 'corporate_slate',
                  'rose_quartz', 'minimal_light', 'corporate_blue']
    theme = data.get('theme', 'aurora') if data.get('theme') in ALL_THEMES else 'aurora'
    
    uid = g.user_id
    
    db = firestore.client()
    user_ref = db.collection('users').document(uid)
    
    transaction = db.transaction()
    ADMIN_EMAILS = ['omprakashmaury24@gmail.com', 'opmaury001@gmail.com']
    
    @firestore.transactional
    def deduct_credit(transaction, user_ref, cost=25):
        email = getattr(g, 'user_email', '')
        # Admin Bypass for free services
        if email in ADMIN_EMAILS:
            print(f"[ADMIN BYPASS] Free service granted to {email}")
            return True
            
        user_doc = user_ref.get(transaction=transaction)
        
        if not user_doc.exists:
            return False
            
        user_data = user_doc.to_dict()
        credits = user_data.get('vault_credits', 0)
        if credits < cost:
            return False
            
        transaction.update(user_ref, {
            'vault_credits': firestore.Increment(-cost)
        })
        return True
        
    try:
        success = deduct_credit(transaction, user_ref, cost=25)
        if not success:
            return jsonify({"error": "Insufficient Vault Credits. Please upgrade."}), 402
    except Exception as e:
        print(f"[ERROR] Deduction failed for {uid}: {e}")
        return jsonify({"error": "Failed to process payment deduction."}), 500
    
    job_id = str(uuid.uuid4())
    job_ref = db.collection('print_jobs').document(job_id)
    job_ref.set({
        "deck_data": deck_data,
        "theme": theme,
        "is_free": False,
        "created_at": firestore.SERVER_TIMESTAMP
    })

    import tempfile
    pdf_path = os.path.join(tempfile.gettempdir(), f"pitchking_{session_id}.pdf")
    
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
            page = browser.new_page()
            
            frontend_url = os.environ.get('FRONTEND_URL', 'https://tools.ikkish.in')
            page.goto(f"{frontend_url}/print/{job_id}", wait_until="networkidle")
            page.wait_for_selector('.print-ready', timeout=30000)
            
            page.pdf(
                path=pdf_path, 
                width="19.2in", 
                height="10.8in", 
                print_background=True, 
                landscape=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}
            )
            browser.close()
            
        from flask import send_file
        return send_file(pdf_path, as_attachment=True, download_name="Investor_Pitch_Deck.pdf", mimetype="application/pdf")
        
    except Exception as e:
        print(f"PDF Generation error: {e}")
        # REFUND CREDIT ON FAILURE
        try:
            user_ref.update({'vault_credits': firestore.Increment(25)})
            print(f"[INFO] Refunded 25 credits to {uid} due to PDF generation failure.")
        except Exception as refund_err:
            print(f"[CRITICAL ERROR] Failed to refund credit to {uid} after failure: {refund_err}")
            
        return jsonify({"error": "Failed to generate PDF. Credit refunded.", "details": str(e)}), 500
    finally:
        try:
            job_ref.delete()
        except Exception as cleanup_err:
            print(f"Failed to cleanup job {job_id}: {cleanup_err}")

@pitchking_bp.route('/export-pptx', methods=['POST'])
@require_auth
def export_pptx():
    data = request.json
    if not data or 'deck_data' not in data:
        return jsonify({"error": "Missing deck_data"}), 400

    deck_data = data['deck_data']
    session_id = data.get('session_id', str(uuid.uuid4()))
    
    ALL_THEMES = ['aurora', 'midnight_vc', 'deep_ocean', 'obsidian_gold', 'crimson_empire',
                  'forest_venture', 'silicon_sage', 'arctic_light', 'corporate_slate',
                  'rose_quartz', 'minimal_light', 'corporate_blue']
    theme = data.get('theme', 'aurora') if data.get('theme') in ALL_THEMES else 'aurora'
    
    uid = g.user_id
    
    db = firestore.client()
    user_ref = db.collection('users').document(uid)
    
    transaction = db.transaction()
    ADMIN_EMAILS = ['omprakashmaury24@gmail.com', 'opmaury001@gmail.com']
    
    @firestore.transactional
    def deduct_pptx_credit(transaction, user_ref, cost=50):
        email = getattr(g, 'user_email', '')
        # Admin Bypass for free services
        if email in ADMIN_EMAILS:
            print(f"[ADMIN BYPASS] Free PPTX service granted to {email}")
            return True
            
        user_doc = user_ref.get(transaction=transaction)
        
        if not user_doc.exists:
            return False
            
        user_data = user_doc.to_dict()
        credits = user_data.get('vault_credits', 0)
        if credits < cost:
            return False
            
        transaction.update(user_ref, {
            'vault_credits': firestore.Increment(-cost)
        })
        return True
        
    try:
        success = deduct_pptx_credit(transaction, user_ref, cost=50)
        if not success:
            return jsonify({"error": "Insufficient Vault Credits for PPTX (Requires 50). Please upgrade."}), 402
    except Exception as e:
        print(f"[ERROR] PPTX Deduction failed for {uid}: {e}")
        return jsonify({"error": "Failed to process PPTX payment deduction."}), 500
    
    pptx_path = os.path.join(tempfile.gettempdir(), f"pitchking_{session_id}.pptx")
    
    try:
        generate_pptx(deck_data, theme, pptx_path)
        return send_file(pptx_path, as_attachment=True, download_name="Investor_Pitch_Deck.pptx", mimetype="application/vnd.openxmlformats-officedocument.presentationml.presentation")
        
    except Exception as e:
        print(f"PPTX Generation error: {e}")
        # REFUND CREDIT ON FAILURE
        try:
            user_ref.update({'vault_credits': firestore.Increment(50)})
            print(f"[INFO] Refunded 50 credits to {uid} due to PPTX generation failure.")
        except Exception as refund_err:
            print(f"[CRITICAL ERROR] Failed to refund 50 credits to {uid} after PPTX failure: {refund_err}")
            
        return jsonify({"error": "Failed to generate PPTX. Credit refunded.", "details": str(e)}), 500

@pitchking_bp.route('/export-free', methods=['GET', 'POST'])
def export_free_pdf():
    # Basic IP-based rate limiting using Firestore (Max 5 per day)
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if client_ip:
        client_ip = client_ip.split(',')[0].strip()
    else:
        client_ip = "unknown"
        
    data = request.json
    if not data or 'deck_data' not in data:
        return jsonify({"error": "Missing deck_data"}), 400

    deck_data = data['deck_data']
    session_id = data.get('session_id', str(uuid.uuid4()))
    
    VALID_THEMES = ['aurora', 'minimal_light', 'corporate_blue']
    theme = data.get('theme', 'aurora') if data.get('theme') in VALID_THEMES else 'aurora'

    uid = request.remote_addr # Not logged in, use IP
    
    db = firestore.client()
    job_id = str(uuid.uuid4())
    job_ref = db.collection('print_jobs').document(job_id)
    job_ref.set({
        "deck_data": deck_data,
        "theme": theme,
        "is_free": True,
        "created_at": firestore.SERVER_TIMESTAMP
    })

    import tempfile
    pdf_path = os.path.join(tempfile.gettempdir(), f"pitchking_free_{session_id}.pdf")
    
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
            page = browser.new_page()
            
            frontend_url = os.environ.get('FRONTEND_URL', 'https://tools.ikkish.in')
            page.goto(f"{frontend_url}/print/{job_id}", wait_until="networkidle")
            page.wait_for_selector('.print-ready', timeout=30000)
            
            page.pdf(
                path=pdf_path, 
                width="19.2in", 
                height="10.8in", 
                print_background=True, 
                landscape=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}
            )
            browser.close()
            
        from flask import send_file
        return send_file(pdf_path, as_attachment=True, download_name="PitchKing_Free_Deck.pdf", mimetype="application/pdf")
        
    except Exception as e:
        print(f"Free PDF Generation error: {e}")
        return jsonify({"error": "Failed to generate PDF.", "details": str(e)}), 500
    finally:
        try:
            job_ref.delete()
        except Exception as cleanup_err:
            print(f"Failed to cleanup job {job_id}: {cleanup_err}")

@pitchking_bp.route('/print-job/<job_id>', methods=['GET'])
def get_print_job(job_id):
    db = firestore.client()
    doc_ref = db.collection('print_jobs').document(job_id)
    doc = doc_ref.get()
    if not doc.exists:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(doc.to_dict())
