export const processMarketPayment = async (productId: string, token: string): Promise<{success: boolean, link?: string, error?: string}> => {
  try {
    const apiUrl = import.meta.env.PROD ? '' : 'http://localhost:10001';
    
    // 1. Create order on the server
    const orderRes = await fetch(`${apiUrl}/api/saas-market/create-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId })
    });
    const orderData = await orderRes.json();
    
    if (!orderData.success) {
      console.error("Order creation failed", orderData.error);
      return { success: false, error: orderData.error };
    }

    return new Promise((resolve) => {
      // 2. Initialize Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Ikkish SaaS Vault",
        description: orderData.product_name,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // 3. Verify payment signature on the server and get link
          const verifyRes = await fetch(`${apiUrl}/api/saas-market/verify`, {
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
            resolve({ success: true, link: verifyData.access_link });
          } else {
            console.error("Signature verification failed");
            resolve({ success: false, error: "Signature verification failed" });
          }
        },
        prefill: {
          name: "Vault User"
        },
        theme: {
          color: "#0f172a"
        },
        modal: {
          ondismiss: function() {
            console.log("Market payment modal dismissed");
            resolve({ success: false, error: "Payment cancelled by user" });
          }
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment failed from UI");
        resolve({ success: false, error: response?.error?.description || "Payment failed" });
      });
      rzp.open();
    });
  } catch (error: any) {
    console.error("Payment error", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};
