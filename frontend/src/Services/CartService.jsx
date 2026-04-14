import axios from "axios";
const API_URL = "http://localhost:3000/cart";

export const get_cart_service = () => axios.get(API_URL);

export const add_to_cart_service = (productId, quantity) =>
    axios.post(`${API_URL}/add`, { productId, quantity });

export const update_cart_quantity_service = (cartItemId, quantity) =>
    axios.put(`${API_URL}/${cartItemId}`, { quantity });

export const remove_from_cart_service = (cartItemId) =>
    axios.delete(`${API_URL}/${cartItemId}`);

export const clear_cart_service = () =>
    axios.delete(`${API_URL}/clear`);