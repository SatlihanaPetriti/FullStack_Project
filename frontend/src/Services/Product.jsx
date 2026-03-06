import axios from "axios";

const URL = "http://localhost:3000/products";

export async function get_products_service() {
    return await axios.get(`${URL}`);
}

export async function get_product_by_id_service(id) {
    return await axios.get(`${URL}/${id}`);
}

export async function create_product_service(data) {
    return await axios.post(`${URL}`, data);
}

export async function update_product_service(id, data) {
    return await axios.put(`${URL}/${id}`, data);
}

export async function delete_product_service(id) {
    return await axios.delete(`${URL}/${id}`);
}
