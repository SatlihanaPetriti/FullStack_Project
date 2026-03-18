import { Form, Row, Col } from "react-bootstrap";

const ProductInfo = ({ formData, errors, onChange }) => {
    return (
        <>
            <h5 className="mb-3">Product Information</h5>

            {/* Rreshti 1: ID dhe Title */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Product ID *</Form.Label>
                        <Form.Control
                            type="text" name="id"
                            value={formData.id}
                            onChange={onChange}
                            required isInvalid={!!errors.id}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.id}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            type="text" name="title"
                            value={formData.title}
                            onChange={onChange}
                            required isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            {/* Rreshti 2: Label, Category, Size */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Label</Form.Label>
                        <Form.Control
                            type="text" name="label"
                            value={formData.label}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category" value={formData.category} onChange={onChange}>
                            <option>Indoor</option>
                            <option>Outdoor</option>
                            <option>Accessories</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Size</Form.Label>
                        <Form.Select name="size" value={formData.size} onChange={onChange}>
                            <option>SM</option>
                            <option>MD</option>
                            <option>LG</option>
                            <option>XL</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Rreshti 3: Price, Sale Price, Sale Percentage */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Price *</Form.Label>
                        <Form.Control
                            type="number" name="price" step="0.01"
                            value={formData.price}
                            onChange={onChange} required
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Sale Price</Form.Label>
                        <Form.Control
                            type="number" name="sale_price" step="0.01"
                            value={formData.sale_price}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Sale Percentage</Form.Label>
                        <Form.Control
                            type="number" name="sale_percentage" step="0.01"
                            value={formData.sale_percentage}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Rreshti 4: Date Added dhe Is Bundle */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Date Added</Form.Label>
                        <Form.Control
                            type="date" name="date_added"
                            value={formData.date_added}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                    <Form.Check
                        type="checkbox" label="Is Bundle"
                        name="is_bundle"
                        checked={formData.is_bundle}
                        onChange={onChange}
                    />
                </Col>
            </Row>
        </>
    );
};

export default ProductInfo;