from flask import Blueprint, jsonify, request, g
from firebase_admin import firestore
from routes.auth import require_auth, _ADMIN_EMAILS

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user/profile', methods=['GET'])
@require_auth
def get_user_profile():
    try:
        uid = g.get('user_id')
        user_email = g.get('user_email', '')
        if not uid:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 401
            
        db = firestore.client()
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()
        
        is_admin = user_email.lower() in _ADMIN_EMAILS if user_email else False

        if not user_doc.exists:
            return jsonify({
                'success': True,
                'data': {
                    'vault_credits': 0,
                    'name': '',
                    'email': user_email,
                    'isAdmin': is_admin
                }
            })
            
        user_data = user_doc.to_dict()
        return jsonify({
            'success': True,
            'data': {
                'vault_credits': user_data.get('vault_credits', 0),
                'name': user_data.get('name', ''),
                'email': user_data.get('email') or user_email,
                'isAdmin': is_admin
            }
        })
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
