import axios from "axios";

const API_URL = "http://localhost:3000/orders";

export const get_my_orders_service = () =>
    axios.get(API_URL);


export const get_order_by_id_service = (orderId) =>
    axios.get(`${API_URL}/${orderId}`);