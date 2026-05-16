import axios from 'axios';
axios.defaults.withCredentials = true;
const API_URL = 'http://localhost:3000/send-email';

// SEND CONTACT MESSAGE
export const send_contact_message_service = (messageData) =>
    axios.post(`${API_URL}/contact`, messageData);