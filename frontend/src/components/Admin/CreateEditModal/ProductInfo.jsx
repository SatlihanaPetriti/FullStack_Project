import { Form, Row, Col } from "react-bootstrap";
import { useCategoryContext } from "../../../Context/Category";

const LABEL_OPTIONS = [
    { value: "", label: "No label" },
    { value: "SALE", label: "SALE" },
    { value: "MOST_GIFTED", label: "MOST GIFTED" },
    { value: "BESTSELLER", label: "BESTSELLER" },
    { value: "NEW", label: "NEW" },
    { value: "LOW_MAINTENANCE", label: "LOW MAINTENANCE" },
    { value: "RARE_BLOOM", label: "RARE BLOOM" },
];

const SIZE_OPTIONS = ["XS", "SM", "MD", "LG", "XL", "XXL"];

const sectionTitleStyle = {
    fontSize: 13,
    fontWeight: 500,
    textTransform: "uppercase",
};

const labelStyle = {
    fontSize: 12,
};

const ProductInfo = ({ formData, errors, onChange }) => {
    const { categories } = useCategoryContext();

    return (
        <>
            <p style={sectionTitleStyle}>Product information</p>

            <Row className="mb-3 text-start g-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label style={labelStyle}>
                            Title <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="e.g. Monstera Deliciosa"
                            value={formData.title}
                            onChange={onChange}
                            required
                            isInvalid={!!errors.title}
                        />

                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label style={labelStyle}>Label</Form.Label>

                        <Form.Select
                            name="label"
                            value={formData.label}
                            onChange={onChange}
                        >
                            {LABEL_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3 text-start g-3">
                <Col md={5}>
                    <Form.Group>
                        <Form.Label style={labelStyle}>
                            Category <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={onChange}
                            required
                        >
                            <option value="">Select category</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={5}>
                    <Form.Group>
                        <Form.Label style={labelStyle}>Date added</Form.Label>

                        <Form.Control
                            type="date"
                            name="date_added"
                            value={formData.date_added}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Form.Group>
                        <Form.Label style={labelStyle}>Size</Form.Label>

                        <Form.Select
                            name="size"
                            value={formData.size}
                            onChange={onChange}
                        >
                            {SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <hr className="my-3" />

            <p style={sectionTitleStyle}>Pricing</p>

            <Row className="mb-3 text-start g-3">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label style={labelStyle}>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={onChange}
                            min={0}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group>
                        <Form.Label style={labelStyle}>
                            Price <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            step="0.5"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={onChange}
                            required
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group>
                        <Form.Label style={labelStyle}>Sale %</Form.Label>
                        <Form.Control
                            type="number"
                            name="sale_percentage"
                            step="0.5"
                            placeholder="0"
                            value={formData.sale_percentage}
                            onChange={onChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};

export default ProductInfo;