import os
import razorpay
from flask import Blueprint, request, jsonify, g
from firebase_admin import firestore
from routes.auth import require_auth

payment_bp = Blueprint('payment_routes', __name__)

def _get_razorpay_client():
    """
    Lazily initialize Razorpay client so it reads env vars
    AFTER load_dotenv() has been called in app.py.
    """
    key_id = os.getenv('RAZORPAY_KEY_ID') or os.getenv('RAZORPAY_TEST_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET') or os.getenv('RAZORPAY_TEST_KEY_SECRET')
    if key_id and key_secret:
        return razorpay.Client(auth=(key_id, key_secret)), key_id
    return None, None

# Centralized Secure Coupons (Mirrors frontend config.js)
COUPONS = {
    'WELCOME50': {'type': 'percent', 'value': 50, 'applicable_plans': ['quarterly']},
    'IKKISH20': {'type': 'percent', 'value': 20, 'applicable_plans': ['quarterly', 'halfyearly', 'yearly']},
    'IKKISH30': {'type': 'flat', 'value': 20, 'applicable_plans': ['yearly']}
}

@payment_bp.route('/api/payment/create-order', methods=['POST'])
def create_order():
    client, razorpay_key_id = _get_razorpay_client()
    if not client:
        return jsonify({'success': False, 'error': 'Razorpay keys not configured'}), 500
        
    try:
        data = request.get_json()
        amount = data.get('amount')
        credits = data.get('credits')
        
        type = data.get('type') # e.g. 'store' or 'subscription' or 'credits'
        plan = data.get('plan')
        items = data.get('items', []) # for cart
        coupon_code = data.get('coupon_code', '').strip().upper()
        
        # Metadata for physical orders
        user_phone = data.get('user_phone', '')
        delivery_address = data.get('delivery_address', '')
        user_email = data.get('user_email', '')

        calculated_amount = 0
        plan_months = 0
        credits = 0

        # SERVER-SIDE PRICE CALCULATION (Zero Trust)
        if type == 'subscription':
            if plan == 'quarterly':
                calculated_amount = 79
                plan_months = 3
            elif plan == 'halfyearly':
                calculated_amount = 149
                plan_months = 6
            elif plan == 'yearly':
                calculated_amount = 249
                plan_months = 12
            else:
                return jsonify({'success': False, 'error': 'Invalid subscription plan'}), 400
        
        elif type == 'credits':
            # Valid Plans Mapping for AI Credits: (amount in INR -> credits)
            VALID_PLANS = {
                499: 1000, 999: 3000, 5999: 20000,
                4788: 1000, 9588: 3000, 57588: 20000
            }
            client_amount = data.get('amount')
            if client_amount not in VALID_PLANS:
                return jsonify({'success': False, 'error': 'Invalid credits plan'}), 400
            calculated_amount = client_amount
            credits = VALID_PLANS[calculated_amount]

        elif type == 'product' or type == 'cart':
            db = firestore.client()
            for item in items:
                # Fetch real price from database
                item_doc = db.collection('market_items').document(item.get('id')).get()
                if item_doc.exists:
                    qty = int(item.get('qty', 1))
                    if qty <= 0:
                        return jsonify({'success': False, 'error': f"Invalid quantity for product {item.get('id')}"}), 400
                    real_price = item_doc.to_dict().get('price', 0)
                    calculated_amount += (real_price * qty)
                else:
                    return jsonify({'success': False, 'error': f"Product {item.get('id')} not found"}), 404

        else:
            return jsonify({'success': False, 'error': 'Invalid order type'}), 400

        # USER AUTH (Optional for physical, Required for Coupon Limits)
        uid = None
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()
            if token:
                import firebase_admin.auth
                try:
                    decoded = firebase_admin.auth.verify_id_token(token)
                    uid = decoded.get('uid')
                except Exception:
                    pass

        # APPLY SERVER-SIDE COUPON VALIDATION
        original_amount = calculated_amount
        discount_value = 0
        if coupon_code and coupon_code in COUPONS:
            if not uid:
                return jsonify({'success': False, 'error': 'You must be logged in to use a coupon'}), 401
                
            db = firestore.client()
            user_doc = db.collection('users').document(uid).get()
            if user_doc.exists:
                used_coupons = user_doc.to_dict().get('used_coupons', [])
                if coupon_code in used_coupons:
                    return jsonify({'success': False, 'error': f'You have already used the coupon {coupon_code}'}), 400

            coupon = COUPONS[coupon_code]
            applicable_plans = coupon.get('applicable_plans', [])
            
            # Subscriptions validation (Ensure it's a subscription and plan matches)
            if applicable_plans:
                if type != 'subscription' or plan not in applicable_plans:
                    return jsonify({'success': False, 'error': f'Coupon {coupon_code} is not valid for this order'}), 400
            
            if coupon.get('type') == 'percent':
                discount_value = round((original_amount * coupon.get('value')) / 100)
            elif coupon.get('type') == 'flat':
                discount_value = coupon.get('value')
                
            calculated_amount = max(0, original_amount - discount_value)

        # HANDLE FREE ORDERS SECURELY
        if calculated_amount <= 0:
            import time
            free_order_id = f"FREE_{int(time.time())}"
            db = firestore.client()
            db.collection('pending_orders').document(free_order_id).set({
                'amount': 0,
                'expected_credits': credits,
                'plan_months': plan_months,
                'type': type,
                'items': items,
                'user_email': user_email.lower(),
                'user_phone': user_phone,
                'delivery_address': delivery_address,
                'coupon_code': coupon_code,
                'created_at': firestore.SERVER_TIMESTAMP
            })
            return jsonify({'success': True, 'is_free': True, 'order_id': free_order_id})

        if calculated_amount <= 0:
            return jsonify({'success': False, 'error': 'Amount must be greater than 0'}), 400
            
        amount_paise = int(calculated_amount * 100)  # Convert to paise
        
        order_data = {
            'amount': amount_paise,
            'currency': 'INR',
            'payment_capture': '1'
        }
        
        order = client.order.create(data=order_data)
        razorpay_order_id = order['id']
        
        # Store subscription months if applicable
        plan_months = 0
        if type == 'subscription':
            if amount == 79: plan_months = 3
            elif amount == 149: plan_months = 6
            elif amount == 249: plan_months = 12

        # Securely store the pending order so we don't trust client later
        try:
            db = firestore.client()
            db.collection('pending_orders').document(razorpay_order_id).set({
                'amount': amount_paise,
                'expected_credits': credits,
                'plan_months': plan_months,
                'type': type,
                'items': items,
                'user_email': user_email.lower(),
                'user_phone': user_phone,
                'delivery_address': delivery_address,
                'coupon_code': coupon_code,
                'created_at': firestore.SERVER_TIMESTAMP
            })
        except Exception as e:
            return jsonify({'success': False, 'error': 'Failed to initialize order in database'}), 500
        
        return jsonify({
            'success': True,
            'order_id': razorpay_order_id,
            'amount': amount_paise,
            'key': razorpay_key_id
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@payment_bp.route('/api/payment/verify', methods=['POST'])
@require_auth
def verify_payment():
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

        # 1. Verify signature strictly (ABSOLUTE FIRST STEP)
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
        
        db = firestore.client()
        
        # 2. Get expected credits and plan details from pending_orders (Zero Client Trust)
        pending_order_ref = db.collection('pending_orders').document(razorpay_order_id)
        pending_doc = pending_order_ref.get()
        if not pending_doc.exists:
            return jsonify({'success': False, 'error': 'Order not found in pending state'}), 404
            
        pending_data = pending_doc.to_dict()
        expected_credits = pending_data.get('expected_credits', 0)
        plan_months = pending_data.get('plan_months', 0)
        
        # 3. Transaction for Idempotency and Credit Assignment
        transaction = db.transaction()
        processed_ref = db.collection('processed_orders').document(razorpay_order_id)
        user_ref = db.collection('users').document(uid)
        
        # Determine if we need to create a market order
        order_type = pending_data.get('type', '')
        market_order_ref = None
        if order_type in ['cart', 'product']:
            from datetime import datetime, timezone
            now = datetime.now(timezone.utc)
            order_display_id = f"IKK-{now.strftime('%Y%m')}-{str(int(now.timestamp()))[-5:]}"
            market_order_ref = db.collection('market_orders').document()
            
            market_order_doc = {
                "order_id": order_display_id,
                "user_email": pending_data.get('user_email', ''),
                "user_phone": pending_data.get('user_phone', ''),
                "delivery_address": pending_data.get('delivery_address', ''),
                "items": pending_data.get('items', []),
                "total_amount": pending_data.get('amount', 0) / 100,  # convert paise to INR
                "coupon_code": pending_data.get('coupon_code', ''),
                "payment_id": razorpay_payment_id,
                "status": "Processing",
                "tracking_link": "",
                "tracking_number": "",
                "courier_name": "",
                "created_at": now,
                "updated_at": now
            }

        @firestore.transactional
        def process_order_in_transaction(transaction, processed_ref, user_ref, expected_credits, plan_months, payment_id, market_order_ref, market_order_doc):
            # Check if already processed (Webhook Replay protection)
            processed_doc = processed_ref.get(transaction=transaction)
            if processed_doc.exists:
                return True # Already processed, return success safely
                
            # Mark as processed
            transaction.set(processed_ref, {
                'payment_id': payment_id,
                'uid': uid,
                'credits_awarded': expected_credits,
                'plan_months': plan_months,
                'processed_at': firestore.SERVER_TIMESTAMP
            })
            
            # Securely insert the market order in the same transaction
            if market_order_ref and market_order_doc:
                transaction.set(market_order_ref, market_order_doc)
            
            # Update user profile securely
            user_doc = user_ref.get(transaction=transaction)
            update_data = {}
            if expected_credits > 0:
                update_data['vault_credits'] = firestore.Increment(expected_credits)
            if plan_months > 0:
                import datetime
                from dateutil.relativedelta import relativedelta
                new_expiry = datetime.datetime.now(datetime.timezone.utc) + relativedelta(months=plan_months)
                update_data['isPro'] = True
                update_data['proExpiry'] = new_expiry
                
            if user_doc.exists:
                if update_data:
                    transaction.update(user_ref, update_data)
            else:
                if 'vault_credits' not in update_data:
                    update_data['vault_credits'] = 0
                transaction.set(user_ref, update_data)
                
            # Track Coupon Usage
            coupon_used = pending_data.get('coupon_code', '')
            if coupon_used:
                transaction.update(user_ref, {'used_coupons': firestore.ArrayUnion([coupon_used])})
                
            return False # Indicates a new process happened

        already_processed = process_order_in_transaction(
            transaction, processed_ref, user_ref, expected_credits, plan_months, 
            razorpay_payment_id, market_order_ref, market_order_doc if order_type in ['cart', 'product'] else None
        )
        
        if already_processed:
            print(f"[INFO] Order {razorpay_order_id} was already processed. Ignoring replay.")

        return jsonify({'success': True, 'payment_id': razorpay_payment_id})
        
    except razorpay.errors.SignatureVerificationError:
        return jsonify({'success': False, 'error': 'Invalid signature'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/api/payment/verify-free-order', methods=['POST'])
@require_auth
def verify_free_order():
    """
    Secure endpoint to process 100% discounted orders that bypassed Razorpay.
    The order must exist in pending_orders with amount == 0.
    """
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        uid = g.user_id
        
        if not order_id or not order_id.startswith('FREE_'):
            return jsonify({'success': False, 'error': 'Invalid free order ID'}), 400
            
        db = firestore.client()
        pending_order_ref = db.collection('pending_orders').document(order_id)
        pending_doc = pending_order_ref.get()
        
        if not pending_doc.exists:
            return jsonify({'success': False, 'error': 'Free order not found in pending state'}), 404
            
        pending_data = pending_doc.to_dict()
        
        if pending_data.get('amount') != 0:
            return jsonify({'success': False, 'error': 'This order requires payment'}), 400
            
        expected_credits = pending_data.get('expected_credits', 0)
        plan_months = pending_data.get('plan_months', 0)
        order_type = pending_data.get('type', '')
        
        transaction = db.transaction()
        processed_ref = db.collection('processed_orders').document(order_id)
        user_ref = db.collection('users').document(uid)
        
        market_order_ref = None
        market_order_doc = None
        if order_type in ['cart', 'product']:
            from datetime import datetime, timezone
            now = datetime.now(timezone.utc)
            order_display_id = f"IKK-{now.strftime('%Y%m')}-{str(int(now.timestamp()))[-5:]}"
            market_order_ref = db.collection('market_orders').document()
            market_order_doc = {
                "order_id": order_display_id,
                "user_email": pending_data.get('user_email', ''),
                "user_phone": pending_data.get('user_phone', ''),
                "delivery_address": pending_data.get('delivery_address', ''),
                "items": pending_data.get('items', []),
                "total_amount": 0,
                "coupon_code": pending_data.get('coupon_code', ''),
                "payment_id": order_id,
                "status": "Processing",
                "created_at": now,
                "updated_at": now
            }

        @firestore.transactional
        def process_free_order_in_transaction(transaction, processed_ref, user_ref, expected_credits, plan_months, market_order_ref, market_order_doc):
            processed_doc = processed_ref.get(transaction=transaction)
            if processed_doc.exists:
                return True 
                
            transaction.set(processed_ref, {
                'payment_id': order_id,
                'uid': uid,
                'credits_awarded': expected_credits,
                'plan_months': plan_months,
                'processed_at': firestore.SERVER_TIMESTAMP
            })
            
            if market_order_ref and market_order_doc:
                transaction.set(market_order_ref, market_order_doc)
            
            user_doc = user_ref.get(transaction=transaction)
            update_data = {}
            if expected_credits > 0:
                update_data['vault_credits'] = firestore.Increment(expected_credits)
            if plan_months > 0:
                import datetime
                from dateutil.relativedelta import relativedelta
                new_expiry = datetime.datetime.now(datetime.timezone.utc) + relativedelta(months=plan_months)
                update_data['isPro'] = True
                update_data['proExpiry'] = new_expiry
                
            if user_doc.exists:
                if update_data: transaction.update(user_ref, update_data)
            else:
                if 'vault_credits' not in update_data: update_data['vault_credits'] = 0
                transaction.set(user_ref, update_data)
                
            # Track Coupon Usage
            coupon_used = pending_data.get('coupon_code', '')
            if coupon_used:
                transaction.update(user_ref, {'used_coupons': firestore.ArrayUnion([coupon_used])})
                
            return False 

        already_processed = process_free_order_in_transaction(
            transaction, processed_ref, user_ref, expected_credits, plan_months, 
            market_order_ref, market_order_doc
        )
        
        return jsonify({'success': True, 'payment_id': order_id})
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
