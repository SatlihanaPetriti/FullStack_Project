import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Row, Col, Table, Alert } from "react-bootstrap";

const IMAGE_BASE_URL = "http://localhost:3000/products/uploads";

const ProductForm = ({ show, onClose, product, onSave, allProducts = [] }) => {
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        label: "",
        category: "Indoor",
        size: "SM",
        price: "",
        sale_price: "",
        sale_percentage: "",
        is_bundle: false,
        date_added: new Date().toISOString().split("T")[0],
        variants: [],
    });

    const [variantInput, setVariantInput] = useState({
        id: "",
        type: "",
        stock: "",
        imageFile: null,
    });

    const [variantPreviewUrl, setVariantPreviewUrl] = useState(null);
    const [idError, setIdError] = useState("");
    const [titleError, setTitleError] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (product) {
            const variantsWithImage = product.variants.map(v => ({
                id: v.id,
                type: v.type,
                stock: v.stock,
                imageName: v.image || null,
                imageFile: null,
                previewUrl: v.image ? `${IMAGE_BASE_URL}/${v.image.replace(/^.*[\\/]/, '')}` : null,
            }));

            setFormData({
                id: product.id || "",
                title: product.title || "",
                label: product.label || "",
                category: product.category || "Indoor",
                size: product.size || "SM",
                price: product.price || "",
                sale_price: product.sale_price || "",
                sale_percentage: product.sale_percentage || "",
                is_bundle: product.is_bundle || false,
                date_added: product.date_added?.split("T")[0] || new Date().toISOString().split("T")[0],
                variants: variantsWithImage,
            });
        } else {
            setFormData({
                id: "",
                title: "",
                label: "",
                category: "Indoor",
                size: "SM",
                price: "",
                sale_price: "",
                sale_percentage: "",
                is_bundle: false,
                date_added: new Date().toISOString().split("T")[0],
                variants: [],
            });
        }

        setIdError("");
        setTitleError("");
        setVariantInput({ id: "", type: "", stock: "", imageFile: null });
        setVariantPreviewUrl(null);
    }, [product, show]);

    const isIdUnique = (idToCheck) => {
        if (!idToCheck) return true;

        if (product) {
            return !allProducts.some(p =>
                p.id.toLowerCase() === idToCheck.toLowerCase() &&
                p.id !== product.id
            );
        }

        return !allProducts.some(p =>
            p.id.toLowerCase() === idToCheck.toLowerCase()
        );
    };

    const isTitleUnique = (titleToCheck) => {
        if (!titleToCheck) return true;

        if (product) {
            return !allProducts.some(p =>
                p.title.toLowerCase() === titleToCheck.toLowerCase() &&
                p.id !== product.id
            );
        }

        return !allProducts.some(p =>
            p.title.toLowerCase() === titleToCheck.toLowerCase()
        );
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "id") {
            const isUnique = isIdUnique(value);
            setIdError(isUnique ? "" : "A product with this ID already exists!");
        }

        if (name === "title") {
            const isUnique = isTitleUnique(value);
            setTitleError(isUnique ? "" : "A product with this title already exists!");
        }

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setVariantInput({
            ...variantInput,
            [name]: value
        });
    };

    const handleVariantImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVariantInput({
                ...variantInput,
                imageFile: file
            });
            setVariantPreviewUrl(URL.createObjectURL(file));
        }
    };

    const addVariant = () => {
        if (!variantInput.id || !variantInput.type) {
            alert("Variant ID and Type are required");
            return;
        }

        if (formData.variants.some(v => v.id === variantInput.id)) {
            alert("Variant ID already exists in this product");
            return;
        }

        setFormData({
            ...formData,
            variants: [...formData.variants, {
                id: variantInput.id,
                type: variantInput.type,
                stock: Number(variantInput.stock) || 0,
                imageName: null,
                imageFile: variantInput.imageFile || null,
                previewUrl: variantPreviewUrl,
            }],
        });

        setVariantInput({ id: "", type: "", stock: "", imageFile: null });
        setVariantPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleReplaceVariantImage = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const newVariants = [...formData.variants];
        newVariants[index] = {
            ...newVariants[index],
            imageFile: file,
            previewUrl: url
        };

        setFormData({
            ...formData,
            variants: newVariants
        });
    };

    const removeVariant = (index) => {
        const newVariants = [...formData.variants];
        newVariants.splice(index, 1);

        setFormData({
            ...formData,
            variants: newVariants
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanedData = {
            ...formData,
            price: Number(formData.price),
            sale_price: formData.sale_price === "" ? null : Number(formData.sale_price),
            sale_percentage: formData.sale_percentage === "" ? null : Number(formData.sale_percentage),
            variants: formData.variants.map(v => ({
                id: v.id,
                type: v.type,
                stock: Number(v.stock),
                imageName: v.imageFile ? null : (v.imageName || null),
            })),
        };

        const imageFiles = formData.variants.map(v => v.imageFile || null);
        onSave(cleanedData, imageFiles);
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {product ? "Edit Product" : "Add New Product"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <h5>Product Information</h5>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Product ID *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    required
                                    isInvalid={!!idError}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {idError}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Title *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    isInvalid={!!titleError}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {titleError}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Label</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option>Indoor</option>
                                    <option>Outdoor</option>
                                    <option>Accessories</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Size</Form.Label>
                                <Form.Select
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                >
                                    <option>SM</option>
                                    <option>MD</option>
                                    <option>LG</option>
                                    <option>XL</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Price *</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Sale Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sale_price"
                                    value={formData.sale_price}
                                    onChange={handleChange}
                                    step="0.01"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Sale Percentage</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sale_percentage"
                                    value={formData.sale_percentage}
                                    onChange={handleChange}
                                    step="0.01"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Date Added</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date_added"
                                    value={formData.date_added}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-end">
                            <Form.Check
                                type="checkbox"
                                label="Is Bundle"
                                name="is_bundle"
                                checked={formData.is_bundle}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    <hr />

                    <h5>Add Variants with Images</h5>

                    <Row className="mb-3 align-items-end">
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Variant ID *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    placeholder="e.g., red-sm"
                                    value={variantInput.id}
                                    onChange={handleVariantChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Type *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="type"
                                    placeholder="e.g., Red Small"
                                    value={variantInput.type}
                                    onChange={handleVariantChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="stock"
                                    placeholder="0"
                                    value={variantInput.stock}
                                    onChange={handleVariantChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleVariantImage}
                                />
                                {variantPreviewUrl && (
                                    <img
                                        src={variantPreviewUrl}
                                        alt="preview"
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 6,
                                            marginTop: 6
                                        }}
                                    />
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="success"
                                onClick={addVariant}
                                className="w-100"
                            >
                                Add
                            </Button>
                        </Col>
                    </Row>

                    {formData.variants.length > 0 && (
                        <>
                            <h6 className="mt-4">Variants List</h6>
                            <Table striped bordered hover responsive size="sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Type</th>
                                        <th>Stock</th>
                                        <th>Image</th>
                                        <th>Replace Image</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.variants.map((variant, index) => (
                                        <tr key={index}>
                                            <td>{variant.id}</td>
                                            <td>{variant.type}</td>
                                            <td>{variant.stock}</td>
                                            <td>
                                                {variant.previewUrl ? (
                                                    <img
                                                        src={variant.previewUrl}
                                                        alt={variant.type}
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            objectFit: "cover",
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                ) : (
                                                    <small className="text-muted">
                                                        No image
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    size="sm"
                                                    onChange={(e) => handleReplaceVariantImage(index, e)}
                                                />
                                            </td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => removeVariant(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}

                    {formData.variants.length === 0 && (
                        <Alert variant="warning" className="mt-3">
                            At least one variant is required
                        </Alert>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={
                            formData.variants.length === 0 ||
                            !!idError ||
                            !!titleError
                        }
                    >
                        {product ? "Save Changes" : "Create Product"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProductForm;