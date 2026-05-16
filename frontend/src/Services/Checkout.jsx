import axios from 'axios';
axios.defaults.withCredentials = true;

const BASE_URL = 'http://localhost:3000';

export const create_payment_intent_service = () => {
    return axios.post(`${BASE_URL}/checkout/create-payment`);
};

export const confirm_order_service = (paymentIntentId) => {
    return axios.post(`${BASE_URL}/checkout/confirm`, { paymentId: paymentIntentId });
};