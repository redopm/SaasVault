import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';

export const processPayment = async (amount: number, token: string, planCredits: number): Promise<boolean> => {
  try {
    const apiUrl = import.meta.env.PROD ? '' : 'http://localhost:10001';
    
    // 1. Create order on the server
    const orderRes = await fetch(`${apiUrl}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, credits: planCredits, type: 'credits' })
    });
    const orderData = await orderRes.json();
    
    if (!orderData.success) {
      console.error("Order creation failed", orderData.error);
      return false;
    }

    return new Promise((resolve) => {
      // 2. Initialize Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Ikkish SaaS Vault",
        description: "Premium Plan Upgrade",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // 3. Verify payment signature on the server and add credits
          const verifyRes = await fetch(`${apiUrl}/api/payment/verify`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            if (analytics) {
              logEvent(analytics, 'purchase', {
                transaction_id: response.razorpay_payment_id,
                value: amount,
                currency: "INR",
                items: [{
                  item_id: 'vault_credits',
                  item_name: `Vault Credits (${planCredits})`,
                  price: amount,
                  quantity: 1
                }]
              });
            }
            resolve(true);
          } else {
            console.error("Signature verification failed");
            resolve(false);
          }
        },
        prefill: {
          name: "Vault User",
          email: "user@tools.ikkish.in"
        },
        theme: {
          color: "#0f172a"
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            resolve(false);
          }
        }
      };

      // @ts-ignore (Razorpay is injected globally via index.html)
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        console.error("Payment failed from UI");
        resolve(false);
      });
      rzp.open();
    });
  } catch (error) {
    console.error("Payment error", error);
    return false;
  }
};
