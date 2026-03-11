import axios from "axios";

const URL = "http://localhost:3000/products";

export async function get_products_service() {
    return await axios.get(`${URL}`);
}

export async function get_product_by_id_service(id) {
    return await axios.get(`${URL}/${id}`);
}

export async function create_product_service(data, images = []) {
    const formData = new FormData();

    // dergon t edhenat ne json string
    formData.append('data', JSON.stringify(data));

    // dergon pa json
    if (images && images.length > 0) {
        images.forEach((image, index) => {
            if (image) {
                formData.append(`variantImage_${index}`, image);
            }
        });
    }

    return await axios.post(`${URL}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export async function update_product_service(id, data, images = []) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (images && images.length > 0) {
        images.forEach((img, index) => {
            if (img) {
                formData.append(`variantImage_${index}`, img); 
            }
        });
    }

    return await axios.put(`${URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export async function delete_product_service(id) {
    return await axios.delete(`${URL}/${id}`);
}