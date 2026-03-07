// ProductForm.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";

// Add allProducts prop
const ProductForm = ({ show, onClose, product, onSave, allProducts = [] }) => {
    //main form (default value)
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

    // VARIANT INPUT
    const [variantInput, setVariantInput] = useState({ id: "", type: "", stock: "" });

    // Add state for validation errors
    const [idError, setIdError] = useState("");
    const [titleError, setTitleError] = useState("");

    // EDIT fill the form ready for edit (add if exists, empty if not)
    useEffect(() => {
        if (product) {
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
                variants: product.variants || [],
            });
            setIdError("");
            setTitleError("");
        } else {
            // CREATE - empty form
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
            setIdError("");
            setTitleError("");
        }
    }, [product, show]); // Add show dependency to reset when modal opens/closes

    // Check if ID is unique
    const isIdUnique = (idToCheck) => {
        if (!idToCheck) return true;

        // If editing, exclude current product
        if (product) {
            return !allProducts.some(p =>
                p.id.toLowerCase() === idToCheck.toLowerCase() &&
                p.id !== product.id
            );
        }

        // If creating, check all products
        return !allProducts.some(p =>
            p.id.toLowerCase() === idToCheck.toLowerCase()
        );
    };

    // Check if title is unique
    const isTitleUnique = (titleToCheck) => {
        if (!titleToCheck) return true;

        // If editing, exclude current product
        if (product) {
            return !allProducts.some(p =>
                p.title.toLowerCase() === titleToCheck.toLowerCase() &&
                p.id !== product.id
            );
        }

        // If creating, check all products
        return !allProducts.some(p =>
            p.title.toLowerCase() === titleToCheck.toLowerCase()
        );
    };

    // function that runs everytime when the user types in an input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Special handling for ID field - check for duplicates in real-time
        if (name === "id") {
            if (!isIdUnique(value)) {
                setIdError("A product with this ID already exists!");
            } else {
                setIdError("");
            }
        }

        // Special handling for title field - check for duplicates in real-time
        if (name === "title") {
            if (!isTitleUnique(value)) {
                setTitleError("A product with this title already exists!");
            } else {
                setTitleError("");
            }
        }

        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setVariantInput({ ...variantInput, [name]: value });
    };

    const addVariant = () => {
        if (!variantInput.id || !variantInput.type)
            return;
        setFormData({
            ...formData,
            variants: [...formData.variants, { ...variantInput, stock: parseInt(variantInput.stock) || 0 }],
        });
        setVariantInput({ id: "", type: "", stock: "" });
    };

    const removeVariant = (index) => {
        const newVariants = [...formData.variants];
        newVariants.splice(index, 1);
        setFormData({ ...formData, variants: newVariants });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedData = {
            id: formData.id,
            title: formData.title,
            label: formData.label || null,
            category: formData.category,
            size: formData.size,
            price: Number(formData.price),
            sale_price: formData.sale_price === "" ? null : Number(formData.sale_price),
            sale_percentage: formData.sale_percentage === "" ? null : Number(formData.sale_percentage),
            is_bundle: formData.is_bundle,
            date_added: formData.date_added,
            variants: formData.variants.map(v => ({
                id: v.id,
                type: v.type,
                stock: Number(v.stock),
            }))
        };
        onSave(cleanedData);
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>{product ? "Edit Product" : "Add New Product"}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Product ID *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    required
                                    disabled={!!product}
                                    isInvalid={!!idError && !product}
                                />
                                {!product && (
                                    <Form.Control.Feedback type="invalid">
                                        {idError}
                                    </Form.Control.Feedback>
                                )}
                                <Form.Text className="text-muted">
                                    {product
                                        ? "ID cannot be changed after creation"
                                        : "Unique product identifier (must be unique)"}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
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
                                <Form.Text className="text-muted">
                                    Product display name (must be unique)
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Label</Form.Label>
                                <Form.Select
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}>
                                    <option value="">None</option>
                                    <option value="NEW">NEW</option>
                                    <option value="BESTSELLER">BESTSELLER</option>
                                    <option value="SALE">SALE</option>
                                    <option value="MOST_GIFTED">MOST_GIFTED</option>
                                    <option value="LOW_MAINTENANCE">LOW_MAINTENANCE</option>
                                    <option value="RARE_BLOOM">RARE_BLOOM</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category *</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required>
                                    <option value="Indoor">Indoor</option>
                                    <option value="Outdoor">Outdoor</option>
                                    <option value="Pet-Friendly">Pet-Friendly</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Size *</Form.Label>
                                <Form.Select name="size" value={formData.size} onChange={handleChange} required>
                                    <option value="XS">XS</option>
                                    <option value="SM">SM</option>
                                    <option value="MD">MD</option>
                                    <option value="LG">LG</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Price *</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Sale Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sale_price"
                                    value={formData.sale_price}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                />
                            
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Sale %</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sale_percentage"
                                    value={formData.sale_percentage}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                />
                               
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            name="is_bundle"
                            label="Is Bundle"
                            checked={formData.is_bundle}
                            onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date Added</Form.Label>
                        <Form.Control
                            type="date"
                            name="date_added"
                            value={formData.date_added}
                            onChange={handleChange} />
                    </Form.Group>

                    <hr />
                    <h5>Variants</h5>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                name="id"
                                placeholder="Variant ID (e.g., ALM-CLAY)"
                                value={variantInput.id}
                                onChange={handleVariantChange}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                name="type"
                                placeholder="Type (CLAY, SLATE, STONE...)"
                                value={variantInput.type}
                                onChange={handleVariantChange}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Control
                                type="number"
                                name="stock"
                                placeholder="Stock"
                                value={variantInput.stock}
                                onChange={handleVariantChange}
                            />
                        </Col>
                        <Col md={2}>
                            <Button variant="success" onClick={addVariant}>Add</Button>
                        </Col>
                    </Row>

                    {formData.variants.length > 0 && (
                        <Table striped bordered size="sm">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.variants.map((v, index) => (
                                    <tr key={index}>
                                        <td>{v.id}</td>
                                        <td>{v.type}</td>
                                        <td>{v.stock}</td>
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => removeVariant(index)}>
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    {formData.variants.length === 0 && (
                        <p className="text-danger">At least one variant is required</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={formData.variants.length === 0 || !!idError || !!titleError}>
                        {product ? "Save Changes" : "Create Product"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProductForm;