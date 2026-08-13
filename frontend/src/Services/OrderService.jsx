import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/orders`;

export const get_my_orders_service = () =>
    axios.get(API_URL);

export const get_all_orders_service = () =>
    axios.get(`${API_URL}/all`);

export const get_order_by_id_service = (orderId) =>
    axios.get(`${API_URL}/${orderId}`);

export const update_order_status_service = (orderId, status) =>
    axios.put(`${API_URL}/${orderId}/status`, { status });