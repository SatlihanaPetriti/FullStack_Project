import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ProductInfo from "./ProductInfo";
import VariantInput from "./VariantInput";
import VariantList from "./VariantList";

const IMAGE_BASE_URL = "http://localhost:3000/products/uploads/variants";

const EMPTY_FORM = {
    title: "",
    label: "",
    category_id: "",
    size: "SM",
    price: "",
    sale_price: "",
    sale_percentage: "",
    is_bundle: false,
    date_added: new Date().toISOString().split("T")[0],
    variants: [],
};

const EMPTY_VARIANT_INPUT = {
    id: "",
    type: "",
    stock: "",
    imageFile: null,
};

const toFormVariant = (v) => ({
    id: v.id || "",
    type: v.type || "",
    stock: v.stock || 0,
    imageName: v.image || "",
    imageFile: null,
    previewUrl: v.image ? `${IMAGE_BASE_URL}/${v.image}` : null,
});

const ProductForm = ({ show, onClose, product, onSave, allProducts = [] }) => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [variantInput, setVariantInput] = useState(EMPTY_VARIANT_INPUT);
    const [variantPreview, setVariantPreview] = useState(null);
    const [errors, setErrors] = useState({ id: "", title: "" });
    const fileInputRef = useRef(null);

    const resetVariantInput = () => {
        setVariantInput(EMPTY_VARIANT_INPUT);
        setVariantPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const isUnique = (field, value) => {
        if (!value) return true;
        return !allProducts.some(p =>
            p[field].toLowerCase() === value.toLowerCase() && p.id !== product?.id
        );
    };

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "",
                label: product.label || "",
                category_id: product.category_id || "",
                size: product.size || "SM",
                price: product.price ?? "",
                sale_price: product.sale_price ?? "",
                sale_percentage: product.sale_percentage ?? "",
                is_bundle: product.is_bundle || false,
                date_added: product.date_added?.split("T")[0] || new Date().toISOString().split("T")[0],
                variants: product.variants?.map(toFormVariant) || [],
            });
        } else {
            setFormData(EMPTY_FORM);
        }
        resetVariantInput();
        setErrors({ title: "" });
    }, [product, show]);

    const handleProductChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "id") {
            setErrors(prev => ({
                ...prev,
                id: isUnique("id", value) ? "" : "A product with this ID already exists!"
            }));
        }
        if (name === "title") {
            setErrors(prev => ({
                ...prev,
                title: isUnique("title", value) ? "" : "A product with this title already exists!"
            }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleVariantFieldChange = (e) => {
        const { name, value } = e.target;
        setVariantInput(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setVariantInput(prev => ({ ...prev, imageFile: file }));
        setVariantPreview(URL.createObjectURL(file));
    };

    const addVariant = () => {
        if (!variantInput.type) {
            alert("Variant Type is required");
            return;
        }
        if (!variantInput.imageFile) {
            alert("Variant image is required");
            return;
        }

        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, {
                id: "", 
                type: variantInput.type,
                stock: Number(variantInput.stock) || 0,
                imageName: null,
                imageFile: variantInput.imageFile,
                previewUrl: variantPreview,
            }]
        }));

        resetVariantInput();
    };

    const replaceVariantImage = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => {
            const updated = [...prev.variants];
            updated[index] = {
                ...updated[index],
                imageFile: file,
                imageName: null,
                previewUrl: URL.createObjectURL(file),
            };
            return { ...prev, variants: updated };
        });
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanedData = {
            title: formData.title,
            label: formData.label,
            category_id: formData.category_id,
            size: formData.size,
            price: Number(formData.price),
            sale_price: formData.sale_price === "" ? null : Number(formData.sale_price),
            sale_percentage: formData.sale_percentage === "" ? null : Number(formData.sale_percentage),
            is_bundle: formData.is_bundle,
            date_added: formData.date_added,
            variants: formData.variants.map(v => ({
                ...(v.id ? { id: v.id } : {}),
                type: v.type,
                stock: Number(v.stock),
                image: v.imageFile ? null : (v.imageName || null),
            })),
        };

        const imageFiles = formData.variants.map(v => v.imageFile || null);
        onSave(cleanedData, imageFiles);
    };

    const canSubmit = formData.variants.length > 0 && !errors.id && !errors.title;

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {product ? "Edit Product" : "Add New Product"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <ProductInfo
                        formData={formData}
                        errors={errors}
                        onChange={handleProductChange}
                    />

                    <hr className="my-4" />

                    <VariantInput
                        variantInput={variantInput}
                        previewUrl={variantPreview}
                        onFieldChange={handleVariantFieldChange}
                        onImageChange={handleVariantImageChange}
                        onAdd={addVariant}
                        fileInputRef={fileInputRef}
                    />

                    <VariantList
                        variants={formData.variants}
                        onReplaceImage={replaceVariantImage}
                        onRemove={removeVariant}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" disabled={!canSubmit}>
                        {product ? "Save Changes" : "Create Product"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProductForm;