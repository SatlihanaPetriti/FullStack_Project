import { createContext, useContext, useState } from 'react';
import {
    create_payment_intent_service,
    confirm_order_service,
} from '../Services/Checkout';
import { useUserContext } from "./Auth";

const CheckoutContext = createContext({});

const CheckoutProvider = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const createPaymentIntent = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await create_payment_intent_service();
            return result.data.clientSecret;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load payment');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const confirmOrder = async (paymentIntentId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await confirm_order_service(paymentIntentId);
            return result.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to confirm order');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const values = { loading, error, createPaymentIntent, confirmOrder };

    return (
        <CheckoutContext.Provider value={values}>
            {props.children}
        </CheckoutContext.Provider>
    );
};

const useCheckoutContext = () => useContext(CheckoutContext);

export { CheckoutProvider, useCheckoutContext };