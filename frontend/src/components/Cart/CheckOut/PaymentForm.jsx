import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCheckoutContext } from '../../../Context/Checkout';

const PAYMENT_ELEMENT_OPTIONS = {
    fields: {
        billingDetails: {
            name: 'auto',
        },
    },
};

const PaymentForm = ({ clientSecret, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();

    const { confirmOrder, loading, error } = useCheckoutContext();
    const [formError, setFormError] = useState(null);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setFormError(null);
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setFormError(submitError.message);
            return;
        }
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
        const orderConfirmed = await confirmOrder(paymentIntent.id);
        if (orderConfirmed) {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handlePaymentSubmit}>
            <PaymentElement options={PAYMENT_ELEMENT_OPTIONS} />

            {(formError || error) && (
                <p className="modal__error">{formError || error}</p>
            )}

            <div className="modal__actions">
                <button type="button" className="co-btn-primary" onClick={onClose}>
                    Cancel
                </button>

                <button
                    type="submit"
                    className="co-btn-primary"
                    disabled={!stripe || loading}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </form>
    );
};

export default PaymentForm;