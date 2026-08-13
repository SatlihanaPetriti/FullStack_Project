import axios from 'axios';
axios.defaults.withCredentials = true;

const BASE_URL = `${import.meta.env.REACT_APP_BACKEND_URL}`;

export const create_payment_intent_service = () => {
    return axios.post(`${BASE_URL}/checkout/create-payment`);
};

export const confirm_order_service = (paymentIntentId) => {
    return axios.post(`${BASE_URL}/checkout/confirm`, { paymentId: paymentIntentId });
};