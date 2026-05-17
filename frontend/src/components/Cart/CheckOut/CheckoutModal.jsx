import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCheckoutContext } from '../../../Context/Checkout';
import './CheckoutModal.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment Form 
const PaymentForm = ({ onSuccess, onClose, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { confirmOrder, loading, error } = useCheckoutContext();
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setFormError(null);

        // STEP 1 — Valido formen
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setFormError(submitError.message);
            return;
        }

        // STEP 2 — Konfirmo pagesen te Stripe
        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard`,
            },
            redirect: 'if_required',
        });

        if (stripeError) {
            setFormError(stripeError.message);
            return;
        }

        // STEP 3 — Konfirmo te backend
        const result = await confirmOrder(paymentIntent.id);
        if (result) onSuccess();
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement options={{
                fields: {
                    billingDetails: { name: 'auto' }
                }
            }} />

            {(formError || error) && (
                <p className="modal__error">{formError || error}</p>
            )}

            <div className="modal__actions">
                <button type="button" className="co-btn-primary" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="co-btn-primary" disabled={!stripe || loading}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </form>
    );
};

// ── Modal kryesor ───────────────────────────────────────────────
const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
    const { createPaymentIntent, loading, error } = useCheckoutContext();
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        setClientSecret(null);

        createPaymentIntent().then((secret) => {
            if (secret) setClientSecret(secret);
        });
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__box" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose}>✕</button>
                <h2 className="modal__title">Complete Payment</h2>
                {error && <p className="modal__error">{error}</p>}

                {!clientSecret || loading ? (
                    <p className="modal__loading">Loading payment...</p>
                ) : (
                    <Elements stripe={stripePromise} options={{
                        clientSecret,
                        appearance: { theme: 'stripe' },
                    }}>
                        <PaymentForm
                            onSuccess={onSuccess}
                            onClose={onClose}
                            clientSecret={clientSecret}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;