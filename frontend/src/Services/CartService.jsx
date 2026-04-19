import axios from "axios";

const API_URL = "http://localhost:3000/cart";

// GET CART
export const get_cart_service = () => axios.get(API_URL);

// ADD TO CART (bulk - FIXED)
export const add_to_cart_service = (items) =>
    axios.post(`${API_URL}/add`, { items });

// UPDATE QUANTITY
export const update_cart_quantity_service = (cartItemId, quantity) =>
    axios.put(`${API_URL}/${cartItemId}`, { quantity });

// REMOVE ITEM
export const remove_from_cart_service = (cartItemId) =>
    axios.delete(`${API_URL}/${cartItemId}`);

// CLEAR CART
export const clear_cart_service = () =>
    axios.delete(`${API_URL}/clear`);