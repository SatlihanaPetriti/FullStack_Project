import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";

const ProductForm = ({ show, onClose, product, onSave }) => {
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
        } else {
            // CREATE-create form 
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
    }, [product]);

    // function that runs everytime when the user types in an input, select an option or checks a checkbox
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };



    //varian data (input fields before clicking ADD)
    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setVariantInput({ ...variantInput, [name]: value });
    };



    //add variant 
    const addVariant = () => {
        //check if the filed are filled if not it stops
        if (!variantInput.id || !variantInput.type)
            return;
        //if yes continue
        //duhet new variant array which will have all product fields(...formData)
        //gjithashtu all excisting variants(...formData.variants)
        //merr iid and type nga input(...variantInput)
        setFormData({
            ...formData,
            variants: [...formData.variants, { ...variantInput, stock: parseInt(variantInput.stock) || 0 }],
        });
        //reset inputs for a new variant
        setVariantInput({ id: "", type: "", stock: "" });
    };


    // Delete variant(index- variant to remove)
    const removeVariant = (index) => {
        const newVariants = [...formData.variants];
        newVariants.splice(index, 1);
        setFormData({ ...formData, variants: newVariants });
    };

    // clean data
    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedData = {
            id: formData.id,
            title: formData.title,
            label: formData.label || null,
            category: formData.category,
            size: formData.size,
            price: Number(formData.price),
            //if empty -send null, if has a value-convert string to number
            sale_price: formData.sale_price === "" ? null : Number(formData.sale_price),
            sale_percentage: formData.sale_percentage === "" ? null : Number(formData.sale_percentage),
            is_bundle: formData.is_bundle,
            date_added: formData.date_added,
            //It takes the array of variants from the form
            // and creates a new array 
            // with each variant's stock converted from a string to a number.
            variants: formData.variants.map(v => ({
                id: v.id,
                type: v.type,
                stock: Number(v.stock),// e nevojshme nga dto e VarantDto must be a number
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
                                />
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
                                />
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
                                    <option value="Succulents">Pet-Friendly</option>
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
                                    step="0.01"//ALLOW 2 DECIMAL
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
                                    step="0.01"
                                />
                                <Form.Text className="text-muted">
                                    If set, this overrides sale %
                                </Form.Text>
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
                                <Form.Text className="text-muted">
                                    Will show "SALE X% OFF" label
                                </Form.Text>
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
                        disabled={formData.variants.length === 0}>
                        {product ? "Save Changes" : "Create Product"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProductForm;