import axios from 'axios';
const URL = "http://localhost:3000/products";
axios.defaults.withCredentials = true;

export async function get_products_service() {
    return await axios.get(`${URL}`);
}

export async function get_product_by_id_service(id) {
    return await axios.get(`${URL}/${id}`);
}

export async function create_product_service(data, images = []) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category_id', data.category_id);
    formData.append('size', data.size);
    formData.append('price', String(data.price));
    if (data.stock != null) { formData.append('stock', String(data.stock)); }
    if (data.label) formData.append('label', data.label);
    if (data.sale_percentage) formData.append('sale_percentage', String(data.sale_percentage));
    if (data.date_added) formData.append('date_added', data.date_added);

    data.variants.forEach((variant, i) => {
        formData.append(`variants[${i}][type]`, variant.type);
        formData.append(`variants[${i}][stock]`, String(variant.stock));
        if (images[i]) formData.append(`variantImage_${i}`, images[i]);
    });

    return await axios.post(`${URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function update_product_service(id, data, images = []) {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.size) formData.append('size', data.size);
    if (data.price) formData.append('price', String(data.price));
    if (data.stock != null) { formData.append('stock', String(data.stock)); }

    formData.append('label', data.label != null ? data.label : '');
    formData.append('sale_percentage', data.sale_percentage != null ? String(data.sale_percentage) : '');

    if (data.date_added) formData.append('date_added', data.date_added);

    if (data.variants) {
        data.variants.forEach((variant, i) => {
            if (variant.id) formData.append(`variants[${i}][id]`, variant.id);
            formData.append(`variants[${i}][type]`, variant.type);
            formData.append(`variants[${i}][stock]`, String(variant.stock));
            if (variant.image && !images[i]) formData.append(`variants[${i}][image]`, variant.image);
            if (images[i]) formData.append(`variantImage_${i}`, images[i]);
        });
    }

    return await axios.put(`${URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
export async function add_to_stock_service(id, stockToAdd) {
    return await axios.put(`${URL}/${id}/add-stock`, { stockToAdd });
}

export async function delete_product_service(id) {
    return await axios.delete(`${URL}/${id}`);
}