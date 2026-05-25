import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import ProductInfo from "./ProductInfo";
import VariantInput from "./VariantInput";
import VariantList from "./VariantList";

const IMAGE_BASE_URL = "http://localhost:3000/products/uploads/variants";

const getToday = () => new Date().toISOString().split("T")[0];

const EMPTY_FORM = {
    title: "",
    label: "",
    category_id: "",
    size: "SM",
    stock: "",
    price: "",
    sale_percentage: "",
    date_added: getToday(),
    variants: [],
};

const EMPTY_VARIANT_INPUT = {
    id: "",
    type: "",
    stock: "",
    imageFile: null,
};

const createPreviewUrl = (file) => URL.createObjectURL(file);

const toFormVariant = (variant) => ({
    id: variant.id || "",
    type: variant.type || "",
    stock: variant.stock || 0,
    imageName: variant.image || "",
    imageFile: null,
    previewUrl: variant.image ? `${IMAGE_BASE_URL}/${variant.image}` : null,
});

const buildNewVariant = (variantInput, previewUrl) => ({
    id: "",
    type: variantInput.type,
    stock: Number(variantInput.stock) || 0,
    imageName: null,
    imageFile: variantInput.imageFile,
    previewUrl,
});

const ProductForm = ({
    show,
    onClose,
    product,
    onSave,
    allProducts = [],
}) => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [variantInput, setVariantInput] = useState(EMPTY_VARIANT_INPUT);
    const [variantPreview, setVariantPreview] = useState(null);
    const [errors, setErrors] = useState({ title: "" });

    const fileInputRef = useRef(null);

    const isEditMode = Boolean(product);

    const canSubmit =
        formData.variants.length > 0 &&
        !errors.title;

    const isUnique = (field, value) => {
        if (!value) return true;

        return !allProducts.some((item) => {
            return (
                item[field]?.toString().toLowerCase() ===
                value.toString().toLowerCase() &&
                item.id !== product?.id
            );
        });
    };

    const resetVariantInput = () => {
        setVariantInput(EMPTY_VARIANT_INPUT);
        setVariantPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const resetErrors = () => {
        setErrors({ title: "" });
    };

    const loadProductData = () => {
        if (!product) {
            setFormData(EMPTY_FORM);
            return;
        }

        setFormData({
            title: product.title || "",
            label: product.label || "",
            category_id: product.category_id || "",
            size: product.size || "SM",
            stock: product.stock ?? "",
            price: product.price ?? "",
            sale_percentage: product.sale_percentage ?? "",
            date_added: product.date_added?.split("T")[0] || getToday(),
            variants: product.variants?.map(toFormVariant) || [],
        });
    };

    useEffect(() => {
        loadProductData();
        resetVariantInput();
        resetErrors();
    }, [product, show]);

    const validateProductField = (name, value) => {
        if (name !== "title") return;

        setErrors((prev) => ({
            ...prev,
            title: isUnique("title", value)
                ? ""
                : "A product with this title already exists!",
        }));
    };

    const updateProductField = (e) => {
        const { name, value, type, checked } = e.target;

        validateProductField(name, value);

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const updateVariantField = (e) => {
        const { name, value } = e.target;

        setVariantInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateVariantImage = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setVariantInput((prev) => ({
            ...prev,
            imageFile: file,
        }));

        setVariantPreview(createPreviewUrl(file));
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

        setFormData((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                buildNewVariant(variantInput, variantPreview),
            ],
        }));

        resetVariantInput();
    };

    const replaceVariantImage = (index, e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setFormData((prev) => {
            const variants = [...prev.variants];

            variants[index] = {
                ...variants[index],
                imageFile: file,
                imageName: null,
                previewUrl: createPreviewUrl(file),
            };

            return {
                ...prev,
                variants,
            };
        });
    };

    const removeVariant = (index) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }));
    };

    const buildSubmitData = () => ({
        title: formData.title,
        label: formData.label,
        category_id: formData.category_id,
        size: formData.size,
        stock: Number(formData.stock),
        price: Number(formData.price),
        sale_percentage:
            formData.sale_percentage === ""
                ? null
                : Number(formData.sale_percentage),
        date_added: formData.date_added,
        variants: formData.variants.map((variant) => ({
            ...(variant.id ? { id: variant.id } : {}),
            type: variant.type,
            stock: Number(variant.stock),
            image: variant.imageFile ? null : variant.imageName || null,
        })),
    });

    const getVariantImageFiles = () => {
        return formData.variants.map((variant) => variant.imageFile || null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = buildSubmitData();
        const imageFiles = getVariantImageFiles();

        onSave(productData, imageFiles);
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditMode ? "Edit Product" : "Add New Product"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <ProductInfo
                        formData={formData}
                        errors={errors}
                        onChange={updateProductField}
                    />

                    <hr className="my-4" />

                    <VariantInput
                        variantInput={variantInput}
                        previewUrl={variantPreview}
                        onFieldChange={updateVariantField}
                        onImageChange={updateVariantImage}
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

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!canSubmit}
                    >
                        {isEditMode ? "Save Changes" : "Create Product"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProductForm;