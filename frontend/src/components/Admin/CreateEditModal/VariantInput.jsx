import { Form, Row, Col, Button } from "react-bootstrap";

const titleStyle = {
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: 600,
    fontSize: 13,
};

const previewStyle = {
    width: 36,
    height: 36,
    objectFit: "cover",
    borderRadius: 6,
    border: "1px solid #ddd",
};

const VariantInput = ({
    variantInput,
    previewUrl,
    onFieldChange,
    fileInputRef,
    onImageChange,
    onAdd,
}) => {
    return (
        <>
            <h6 className="mb-3" style={titleStyle}>
                Add Variants with Images
            </h6>

            <Row className="mb-3 align-items-end text-start g-3">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Type *</Form.Label>

                        <Form.Control
                            type="text"
                            name="type"
                            placeholder="pot color"
                            value={variantInput.type}
                            onChange={onFieldChange}
                        />
                    </Form.Group>
                </Col>

                <Col style={{ maxWidth: 90 }}>
                    <Form.Group>
                        <Form.Label>Stock</Form.Label>

                        <Form.Control
                            type="number"
                            name="stock"
                            placeholder="0"
                            value={variantInput.stock}
                            onChange={onFieldChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Image</Form.Label>

                        <div className="d-flex align-items-center gap-2">
                            <Form.Control
                                type="file"
                                onChange={onImageChange}
                                ref={fileInputRef}
                            />

                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    style={previewStyle}
                                />
                            )}
                        </div>
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Button
                        variant="success"
                        onClick={onAdd}
                        className="w-100"
                        style={{ height: 38 }}
                    >
                        Add
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default VariantInput;