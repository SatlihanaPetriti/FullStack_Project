import axios from 'axios';
axios.defaults.withCredentials = true;
const API_URL = `${import.meta.env.REACT_APP_BACKEND_URL}/send-email`;

// SEND CONTACT MESSAGE
export const send_contact_message_service = (messageData) =>
    axios.post(`${API_URL}/contact`, messageData);