import os
import razorpay
from flask import Blueprint, request, jsonify, g, send_file
from firebase_admin import firestore
from routes.auth import require_auth

saas_market_bp = Blueprint('saas_market_routes', __name__)

def _get_razorpay_client():
    key_id = os.getenv('RAZORPAY_KEY_ID') or os.getenv('RAZORPAY_TEST_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET') or os.getenv('RAZORPAY_TEST_KEY_SECRET')
    if key_id and key_secret:
        return razorpay.Client(auth=(key_id, key_secret)), key_id
    return None, None

# Hardcoded product definitions
MARKET_PRODUCTS = {
    'ecommerce_ui_kit': {
        'name': 'E-commerce Dashboard UI Kit',
        'description': 'Premium Figma files & Tailwind components for D2C brands, marketplaces, and vendors.',
        'price_inr': 999,
        'features': [
            'Admin, Vendor & Analytics Templates',
            'Fully Responsive & Dark Mode Support',
            'Built with Tailwind CSS v4',
            'Recharts Data Visualizations'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'  # Served via signed URL from /api/saas-market/download/
    },
    'saas_dashboard_ui_kit': {
        'price_inr': 999,
        'name': 'SaaS Dashboard UI Kit',
        'description': 'Premium Figma files & Tailwind components for SaaS dashboards.',
        'features': [
            '100+ Premium Tailwind CSS Components',
            '5 Pre-built Dashboard Templates',
            'Fully Responsive & Dark Mode Support',
            'Figma Source Files Included'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'  # Served via signed URL from /api/saas-market/download/
    },
    'agency_onboarding_kit': {
        'price_inr': 999,
        'name': 'Agency Onboarding Kit',
        'description': 'Notion workspace duplicate for freelance and agency client onboarding.',
        'features': [
            'Client Portal Notion Template',
            'Project Management Kanban',
            'Invoicing & Contracts DB',
            'Automated Client Questionnaires'
        ],
        'isComingSoon': True,
        'link': 'https://www.notion.so/example_agency_kit'
    },
    'ux_audit_checklist': {
        'price_inr': 999,
        'name': 'SaaS UX/UI Conversion Audit Checklist',
        'description': 'A high-value PDF and Notion Checklist to audit your landing page conversion rates.',
        'features': [
            '150-Point UX Checklist',
            'Landing Page Conversion Hacks',
            'Mobile Optimization Guide',
            'Notion Database Format'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    },
    'landing_kit_saas': {
        'price_inr': 999,
        'name': 'SaaS Landing Page & Social Kit',
        'description': 'Deployable HTML/CSS landing page + social media assets for Micro-SaaS founders. Netlify-ready in 30 seconds.',
        'features': [
            'Deployable HTML/CSS Landing Page',
            '4 Social Media Assets (HTML)',
            'Decoy Pricing & Waitlist Sections',
            'CSS Variable Customization Guide'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    },
    'landing_kit_ai': {
        'price_inr': 999,
        'name': 'AI Tool Landing Page Kit',
        'description': 'Dark glassmorphism landing page + social kit for AI wrappers, chatbots, and generative tools. Ship your waitlist today.',
        'features': [
            'Dark Glassmorphism HTML/CSS Page',
            'Animated Hero with Typing Effect',
            '4 AI-Themed Social Assets (HTML)',
            'Waitlist Capture Section Built-in'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    },
    'landing_kit_agency': {
        'price_inr': 999,
        'name': 'Agency Portfolio & Lead Gen Kit',
        'description': 'Bold editorial portfolio landing page and social authority templates for freelancers and agencies charging premium rates.',
        'features': [
            'Editorial HTML/CSS Portfolio Page',
            'Case Study & Testimonial Sections',
            '4 LinkedIn Authority Post Templates',
            'Services & Pricing Section Built-in'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    },
    'landing_kit_ecommerce': {
        'price_inr': 999,
        'name': 'E-commerce Store & Ads Kit',
        'description': 'High-conversion D2C product landing page with scarcity mechanics, trust badges, and ad creative templates.',
        'features': [
            'Conversion-First HTML/CSS Store Page',
            'Urgency & Scarcity Sections Built-in',
            '4 Ad Creative Templates (HTML)',
            'Trust Badge & Review Grid Sections'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    },
    'landing_kit_edtech': {
        'price_inr': 999,
        'name': 'EdTech & Course Creator Kit',
        'description': 'Trust-first course landing page with curriculum, instructor bio, student results sections + launch promo templates.',
        'features': [
            'Course HTML/CSS Landing Page',
            'Curriculum & Enrollment Sections',
            '4 Launch Promo Templates (HTML)',
            '5-Email Nurture Sequence Guide'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    },
    'landing_kit_mobile': {
        'price_inr': 999,
        'name': 'Mobile App Promo Kit',
        'description': 'Device-mockup landing page and App Store screenshot templates for indie developers targeting 10,000+ downloads.',
        'features': [
            'CSS Device Mockup Landing Page',
            'App Store Screenshot Templates (HTML)',
            '4 Launch Day Social Assets (HTML)',
            'Netlify Deploy Guide Included'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    },
    'landing_kit_health': {
        'price_inr': 999,
        'name': 'HealthTech & Clinic Kit',
        'description': 'Calm, trust-first landing page for clinics, therapists, and digital health startups with booking & credential sections.',
        'features': [
            'Trust-First HTML/CSS Clinic Page',
            'Booking & FAQ Sections Built-in',
            '4 Educational Social Templates (HTML)',
            'HIPAA Disclaimer Copy Templates'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    },
    'landing_kit_fintech': {
        'price_inr': 999,
        'name': 'FinTech & Web3 Startup Kit',
        'description': 'Enterprise-grade deep navy landing page with security signals, data viz sections, and Twitter thread assets.',
        'features': [
            'Enterprise HTML/CSS FinTech Page',
            'Security & Compliance Sections',
            '4 Twitter Thread Graphics (HTML)',
            'Investor Metrics Section Built-in'
        ],
        'isComingSoon': False,
        'link': 'FIREBASE_STORAGE'
    }
}

@saas_market_bp.route('/api/saas-market/products', methods=['GET'])
def get_products():
    """Return product catalog (without fulfillment links)."""
    safe_products = {}
    for pid, data in MARKET_PRODUCTS.items():
        safe_products[pid] = {
            'id': pid,
            'price_inr': data['price_inr'],
            'name': data['name'],
            'description': data['description'],
            'features': data['features'],
            'isComingSoon': data['isComingSoon']
        }
    return jsonify({'success': True, 'products': safe_products})

@saas_market_bp.route('/api/saas-market/my-purchases', methods=['GET'])
@require_auth
def get_my_purchases():
    """Return the authenticated user's purchased products."""
    try:
        db = firestore.client()
        purchases = []
        docs = db.collection('saas_vault_purchases').where('uid', '==', g.user_id).stream()
        for doc in docs:
            purchases.append(doc.to_dict())
        return jsonify({'success': True, 'purchases': purchases})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@saas_market_bp.route('/api/saas-market/create-order', methods=['POST'])
@require_auth
def create_market_order():
    client, razorpay_key_id = _get_razorpay_client()
    if not client:
        return jsonify({'success': False, 'error': 'Razorpay keys not configured'}), 500
        
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        
        if not product_id or product_id not in MARKET_PRODUCTS:
            return jsonify({'success': False, 'error': 'Invalid product'}), 400
            
        product = MARKET_PRODUCTS[product_id]
        if product.get('isComingSoon'):
            return jsonify({'success': False, 'error': 'Product is not available for purchase yet'}), 400

        uid = g.user_id
        
        # Check for duplicate purchase
        db = firestore.client()
        existing_purchases = db.collection('saas_vault_purchases').where('uid', '==', uid).where('product_id', '==', product_id).limit(1).get()
        if len(existing_purchases) > 0:
            return jsonify({'success': False, 'error': 'You have already purchased this product'}), 400

        amount_paise = int(product['price_inr'] * 100)
        
        order_data = {
            'amount': amount_paise,
            'currency': 'INR',
            'payment_capture': '1',
            'notes': {
                'product_id': product_id,
                'uid': uid
            }
        }
        
        order = client.order.create(data=order_data)
        razorpay_order_id = order['id']
        
        db = firestore.client()
        db.collection('pending_saas_market_orders').document(razorpay_order_id).set({
            'amount': amount_paise,
            'product_id': product_id,
            'uid': uid,
            'created_at': firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({
            'success': True,
            'order_id': razorpay_order_id,
            'amount': amount_paise,
            'key': razorpay_key_id,
            'product_name': product['name']
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@saas_market_bp.route('/api/saas-market/verify', methods=['POST'])
@require_auth
def verify_market_payment():
    client, _ = _get_razorpay_client()
    if not client:
        return jsonify({'success': False, 'error': 'Razorpay keys not configured'}), 500
        
    try:
        data = request.get_json()
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        uid = g.user_id
        
        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return jsonify({'success': False, 'error': 'Missing payment verification data'}), 400

        # Verify signature
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
        
        db = firestore.client()
        
        # Get pending order
        pending_order_ref = db.collection('pending_saas_market_orders').document(razorpay_order_id)
        pending_doc = pending_order_ref.get()
        
        if not pending_doc.exists:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
            
        order_data = pending_doc.to_dict()
        product_id = order_data.get('product_id')
        
        if uid != order_data.get('uid'):
            return jsonify({'success': False, 'error': 'Unauthorized user for this order'}), 403
            
        product = MARKET_PRODUCTS.get(product_id)
        if not product:
            return jsonify({'success': False, 'error': 'Product no longer exists'}), 404
            
        # Amount Verification (Zero Trust)
        expected_amount = int(product['price_inr'] * 100)
        if order_data.get('amount') != expected_amount:
            return jsonify({'success': False, 'error': 'Amount mismatch detected'}), 400
            
        # Stop Replay Attacks
        purchase_ref = db.collection('saas_vault_purchases').document(f"{uid}_{product_id}_{razorpay_payment_id}")
        if purchase_ref.get().exists:
            return jsonify({'success': False, 'error': 'Payment already verified'}), 400
            
        # Register purchase in Firestore
        purchase_ref.set({
            'uid': uid,
            'product_id': product_id,
            'product_name': product['name'],
            'price_inr': product['price_inr'],
            'payment_id': razorpay_payment_id,
            'order_id': razorpay_order_id,
            'purchased_at': firestore.SERVER_TIMESTAMP,
            'access_link': product['link'],
            'download_count': 0
        })
        
        return jsonify({
            'success': True,
            'payment_id': razorpay_payment_id,
            'product_id': product_id,
            'access_link': product['link']
        })
        
    except razorpay.errors.SignatureVerificationError:
        return jsonify({'success': False, 'error': 'Invalid signature'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@saas_market_bp.route('/api/saas-market/download/<product_id>', methods=['GET'])
@require_auth
def download_product(product_id):
    """Secure download route for digital products."""
    try:
        # 1. Verify product exists
        if product_id not in MARKET_PRODUCTS:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
            
        # 2. Verify purchase
        db = firestore.client()
        existing_purchases = db.collection('saas_vault_purchases').where('uid', '==', g.user_id).where('product_id', '==', product_id).limit(1).get()
        
        if len(existing_purchases) == 0:
            return jsonify({'success': False, 'error': 'Unauthorized: You have not purchased this product.'}), 403
            
        purchase_doc = existing_purchases[0]
        purchase_ref = purchase_doc.reference
        
        # Atomic Transaction for Download Rate Limiting
        @firestore.transactional
        def increment_download_count(transaction, doc_ref):
            snapshot = doc_ref.get(transaction=transaction)
            current_count = snapshot.get('download_count')
            if current_count is None:
                current_count = 0
                
            if current_count >= 5:
                return False
                
            transaction.update(doc_ref, {
                'download_count': current_count + 1,
                'last_downloaded_at': firestore.SERVER_TIMESTAMP
            })
            return True

        transaction = db.transaction()
        allowed = increment_download_count(transaction, purchase_ref)
        
        if not allowed:
            return jsonify({'success': False, 'error': 'Download limit exceeded (max 5). Please contact support.'}), 429
            
        # 3. Serve from Firebase Storage using a Signed URL
        from firebase_admin import storage
        import datetime
        from flask import redirect
        
        try:
            bucket = storage.bucket('ikkish-prep.firebasestorage.app')
            blob = bucket.blob(f'saas_market_products/{product_id}.zip')
            
            # Generate a signed URL valid for 60 seconds (Optimal window)
            signed_url = blob.generate_signed_url(expiration=datetime.timedelta(seconds=60))
            return jsonify({'success': True, 'url': signed_url})
        except Exception as storage_err:
            return jsonify({'success': False, 'error': f'Storage Error: {str(storage_err)}'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
