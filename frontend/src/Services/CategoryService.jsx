import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = "http://localhost:3000/categories";

// GET ALL
export const get_categories_service = () => axios.get(API_URL);

// GET BY ID
export const get_category_by_id_service = (id) =>
    axios.get(`${API_URL}/${id}`);

// CREATE
export const create_category_service = (data, image) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (image) {
        formData.append("image", image);
    }
    return axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// UPDATE
export const update_category_service = (id, data, image) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (image) {
        formData.append("image", image);
    }
    return axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// DELETE
export const delete_category_service = (id) =>
    axios.delete(`${API_URL}/${id}`);

export const get_products_by_category_service = (categoryId) =>
    axios.get(`${API_URL}/${categoryId}/all-products`);