import axios from "axios";
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/favorites`;

export const get_favorites_service = () =>
    axios.get(API_URL);

export const add_favorite_service = (productId) =>
    axios.post(`${API_URL}/${productId}`);

export const remove_favorite_service = (productId) =>
    axios.delete(`${API_URL}/${productId}`);
