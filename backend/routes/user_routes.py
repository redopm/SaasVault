from flask import Blueprint, jsonify, request
from firebase_admin import firestore
from routes.auth import require_auth

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user/profile', methods=['GET'])
@require_auth
def get_user_profile():
    try:
        uid = request.user.get('uid')
        if not uid:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 401
            
        db = firestore.client()
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({
                'success': True,
                'data': {
                    'vault_credits': 0,
                    'name': request.user.get('name', ''),
                    'email': request.user.get('email', '')
                }
            })
            
        user_data = user_doc.to_dict()
        return jsonify({
            'success': True,
            'data': {
                'vault_credits': user_data.get('vault_credits', 0),
                'name': user_data.get('name') or request.user.get('name', ''),
                'email': user_data.get('email') or request.user.get('email', '')
            }
        })
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
