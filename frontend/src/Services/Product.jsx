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
        // te dhenat baze te productit 
    formData.append('id', data.id);
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('size', data.size);
    formData.append('price', String(data.price));
       // te dhenat opsionale nese ekzistojne
    if (data.label) formData.append('label', data.label);
    if (data.sale_price) formData.append('sale_price', String(data.sale_price));
    if (data.sale_percentage) formData.append('sale_percentage', String(data.sale_percentage));
    if (data.is_bundle != null) formData.append('is_bundle', String(data.is_bundle));
    if (data.date_added) formData.append('date_added', data.date_added);
    // variante (kur producti nuk ka variants)
    data.variants.forEach((variant, i) => {
        // dergohet baza e variantit
        formData.append(`variants[${i}][id]`, variant.id);
        formData.append(`variants[${i}][type]`, variant.type);
        formData.append(`variants[${i}][stock]`, String(variant.stock));
        // dergo imazhin per kete variant
        if (images[i]) {
            formData.append(`variantImage_${i}`, images[i]);
        }
    });

    return await axios.post(`${URL}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export async function update_product_service(id, data, images = []) {
    const formData = new FormData();
    // te dhenat e produktit qe vijne nga data
    if (data.title) formData.append('title', data.title);
    if (data.category) formData.append('category', data.category);
    if (data.size) formData.append('size', data.size);
    if (data.price) formData.append('price', String(data.price));
    if (data.label) formData.append('label', data.label);
    if (data.sale_price) formData.append('sale_price', String(data.sale_price));
    if (data.sale_percentage) formData.append('sale_percentage', String(data.sale_percentage));
    if (data.is_bundle != null) formData.append('is_bundle', String(data.is_bundle));
    if (data.date_added) formData.append('date_added', data.date_added);
        // variante nese ekziston
    if (data.variants) {
        data.variants.forEach((variant, i) => {
            // dergohet baza
            formData.append(`variants[${i}][id]`, variant.id);
            formData.append(`variants[${i}][type]`, variant.type);
            formData.append(`variants[${i}][stock]`, String(variant.stock));
            // ruhet imazhi ekzistues
            if (variant.image && !images[i]) {
                formData.append(`variants[${i}][image]`, variant.image);
            }
            // dergohet imazhi i ri
            if (images[i]) {
                formData.append(`variantImage_${i}`, images[i]);
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