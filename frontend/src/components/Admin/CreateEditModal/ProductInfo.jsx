import { Form, Row, Col } from "react-bootstrap";
import { useCategoryContext } from "../../../Context/Category";

const ProductInfo = ({ formData, errors, onChange }) => {
    const { categories } = useCategoryContext();

    return (
        <>
            <p style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase' }}>
                Product information
            </p>

            <Row className="mb-3 text-start g-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label style={{ fontSize: 12 }}>Title <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text" name="title"
                            placeholder="e.g. Monstera Deliciosa"
                            value={formData.title}
                            onChange={onChange}
                            required isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label style={{ fontSize: 12 }}>Label</Form.Label>
                        <Form.Select name="label" value={formData.label} onChange={onChange}>
                            <option value="">No label</option>
                            <option value="SALE">SALE</option>
                            <option value="MOST_GIFTED">MOST GIFTED</option>
                            <option value="BESTSELLER">BESTSELLER</option>
                            <option value="NEW">NEW</option>
                            <option value="LOW_MAINTENANCE">LOW MAINTENANCE</option>
                            <option value="RARE_BLOOM">RARE BLOOM</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3 text-start g-3">
                <Col md={5}>
                    <Form.Group>
                        <Form.Label style={{ fontSize: 12 }}>Category <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={onChange}
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={5}>
                    <Form.Group>
                        <Form.Label style={{ fontSize: 12 }}>Date added</Form.Label>
                        <Form.Control
                            type="date" name="date_added"
                            value={formData.date_added}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label style={{ fontSize: 12 }}>Size</Form.Label>
                        <Form.Select name="size" value={formData.size} onChange={onChange}>
                            <option>XS</option>
                            <option>SM</option>
                            <option>MD</option>
                            <option>LG</option>
                            <option>XL</option>
                            <option>XXL</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <hr className="my-3" />

            <p style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase'}}>
                Pricing
            </p>
            <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={onChange}
                    min={0}
                />
            </Form.Group>

            <Row className="mb-3 text-start g-3">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label style={{ fontSize: 12 }}>Price <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="number" name="price" step="0.5"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={onChange} required
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label style={{ fontSize: 12 }}>Sale price</Form.Label>
                        <Form.Control
                            type="number" name="sale_price" step="0.5"
                            placeholder="0.00"
                            value={formData.sale_price}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label style={{ fontSize: 12 }}>Sale %</Form.Label>
                        <Form.Control
                            type="number" name="sale_percentage" step="0.5"
                            placeholder="0"
                            value={formData.sale_percentage}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex align-items-center ms-2">
                <Form.Check
                    type="checkbox"
                    name="is_bundle"
                    checked={formData.is_bundle}
                    onChange={onChange}
                    id="is_bundle"
                />
                <Form.Label
                    htmlFor="is_bundle"
                    style={{ fontSize: 14, margin: 0, cursor: 'pointer' }}
                >
                    Is bundle
                </Form.Label>
            </div>
        </>
    );
};

export default ProductInfo;