import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = `${import.meta.env.REACT_APP_BACKEND_URL}/mail`;


export const get_subscribers_service = () =>
    axios.get(`${API_URL}/subscribers`);

export const subscribe_service = (email) =>
    axios.post(`${API_URL}/subscribe`, { email });

export const unsubscribe_service = (email) =>
    axios.get(`${API_URL}/unsubscribe`, {
        params: { email },
    });

export const send_newsletter_service = (data) =>
    axios.post(`${API_URL}/send-newsletter`, data);