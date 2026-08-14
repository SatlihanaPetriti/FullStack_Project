import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCheckoutContext } from '../../../Context/Checkout';
import PaymentForm from './PaymentForm';

import './CheckoutModal.css';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);

const getStripeOptions = (clientSecret) => ({
    clientSecret,
    appearance: {
        theme: 'stripe',
    },
});

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
    const { createPaymentIntent, loading, error } = useCheckoutContext();

    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const initializePayment = async () => {
            setClientSecret(null);

            const secret = await createPaymentIntent();

            if (secret) {
                setClientSecret(secret);
            }
        };

        initializePayment();
    }, [isOpen]);

    if (!isOpen) return null;

    const isPaymentLoading = !clientSecret || loading;

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__box" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose}>
                    ✕
                </button>

                <h2 className="modal__title">Complete Payment</h2>

                {error && <p className="modal__error">{error}</p>}

                {isPaymentLoading ? (
                    <p className="modal__loading">Loading payment...</p>
                ) : (
                    <Elements stripe={stripePromise} options={getStripeOptions(clientSecret)}>
                        <PaymentForm
                            clientSecret={clientSecret}
                            onSuccess={onSuccess}
                            onClose={onClose}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;