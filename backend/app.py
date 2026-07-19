import os
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load Environment Variables
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)
    print(f"[Info] Loaded .env file from {env_path}")

# Initialize Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials
import json

firebase_key_path = os.getenv('FIREBASE_ADMIN_CREDENTIALS', 'firebase-adminsdk.json')
firebase_key_abs_path = os.path.join(os.path.dirname(__file__), firebase_key_path)

try:
    if os.path.exists(firebase_key_abs_path):
        cred = credentials.Certificate(firebase_key_abs_path)
        firebase_admin.initialize_app(cred)
        print(f"[OK] Firebase Admin initialized with {firebase_key_path}")
    else:
        env_cred = os.getenv('FIREBASE_ADMIN_CREDENTIALS_JSON')
        if env_cred:
            cred_dict = json.loads(env_cred)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("[OK] Firebase Admin initialized from Environment Variable")
except Exception as e:
    print(f"[ERROR] Failed to initialize Firebase Admin: {e}")

# Initialize Database Module
import database as db_utils
db_utils.init_db()

# Create Flask App
app = Flask(__name__)

# CORS Configuration
CORS(app, supports_credentials=True)

# Set Maximum File Upload Size (50 MB)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

# ============= REGISTER BLUEPRINTS =============
from routes.pitchking_routes import pitchking_bp
from routes.saas_market_routes import saas_market_bp
from routes.prompt_vault_routes import prompt_vault_bp
from routes.payment_routes import payment_bp

app.register_blueprint(pitchking_bp, url_prefix='/api/pitchking')
app.register_blueprint(saas_market_bp)
app.register_blueprint(prompt_vault_bp)
app.register_blueprint(payment_bp)

# ============= GLOBAL ERROR HANDLERS =============
@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'success': False, 'error': 'An internal error occurred.'}), 500

# ============= RUN SERVER =============
if __name__ == "__main__":
    port = int(os.getenv("PORT", 10001))
    app.run(host='0.0.0.0', port=port, debug=True)
