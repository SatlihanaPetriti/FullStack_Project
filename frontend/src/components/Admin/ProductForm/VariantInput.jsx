import { Form, Row, Col, Button } from "react-bootstrap";


const VariantInput = ({ variantInput, previewUrl, onFieldChange, onImageChange, onAdd }) => {

    return (
        <>
            <h5 className="mb-3">Add Variants with Images</h5>

            <Row className="mb-3 align-items-end">
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Variant ID *</Form.Label>
                        <Form.Control
                            type="text" name="id" placeholder="e.g., red-sm"
                            value={variantInput.id}
                            onChange={onFieldChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Type *</Form.Label>
                        <Form.Control
                            type="text" name="type" placeholder="e.g., Red Small"
                            value={variantInput.type}
                            onChange={onFieldChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number" name="stock" placeholder="0"
                            value={variantInput.stock}
                            onChange={onFieldChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file" accept="image/*"
                            onChange={onImageChange}
                        />
                        {previewUrl && (
                            <img src={previewUrl} alt="preview"
                                style={{ width: 60, height: 60, borderRadius: 6, marginTop: 6 }} />
                        )}
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Button variant="success" onClick={onAdd} className="w-100">
                    Add
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default VariantInput;