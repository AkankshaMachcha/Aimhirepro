import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  fetchRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../../services/paymentService';

const UpgradeAccountButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [razorpayKey, setRazorpayKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadKey = async () => {
      try {
        const key = await fetchRazorpayKey();
        setRazorpayKey(key);
      } catch (err) {
        toast.error('Failed to load Razorpay key');
      }
    };
    loadKey();
  }, []);

  const isFreeUser = user?.authority?.split(" ").includes("FREE");

  if (!user) return <p className="text-center text-muted">Loading user info...</p>;
  if (!isFreeUser) return null;

  const handleUpgrade = async () => {
    if (!razorpayKey) {
      toast.error('Razorpay key not loaded');
      return;
    }

    setLoading(true);
    try {
      const order = await createRazorpayOrder();

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: "AimHirePro",
        description: "Premium Upgrade",
        order_id: order.orderId,

        handler: async (response) => {
          try {
            const updatedUser = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment Verified and Account Upgraded");

            const oldUser = JSON.parse(localStorage.getItem("user")) || {};
            const newUser = { ...oldUser, authority: updatedUser.authority };

            localStorage.setItem("user", JSON.stringify(newUser));
            localStorage.setItem("authority", updatedUser.authority);
            dispatch(setUser(newUser));

            // Clean Razorpay junk keys
            Object.keys(localStorage).forEach((key) => {
              if (key.startsWith("rzp_")) {
                localStorage.removeItem(key);
              }
            });

            navigate("/dashboard");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: user.firstName,
          email: user.email,
        },
        theme: {
          color: "#0057D9",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Payment failed. Please try again.');
      // console.error('Upgrade error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-outline-primary"
      onClick={handleUpgrade}
      disabled={!razorpayKey || loading}
    >
      {loading ? 'Processing...' : 'Upgrade to Premium'}
    </button>
  );
};

export default UpgradeAccountButton;
