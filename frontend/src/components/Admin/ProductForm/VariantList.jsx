import { Table, Button, Alert, Form } from "react-bootstrap";

const VariantRow = ({ variant, index, onReplaceImage, onRemove }) => (
    <tr>
        <td>{variant.id}</td>
        <td>{variant.type}</td>
        <td>{variant.stock}</td>
        <td>
            {variant.previewUrl ? (
                <img src={variant.previewUrl} alt={variant.type}
                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }} />
            ) : (
                <small className="text-muted">No image</small>
            )}
        </td>
        <td>
            <Form.Control
                type="file" accept="image/*" size="sm"
                onChange={(e) => onReplaceImage(index, e)}
            />
        </td>
        <td>
            <Button variant="danger" size="sm" onClick={() => onRemove(index)}>
                Remove
            </Button>
        </td>
    </tr>
);

const VariantList = ({ variants, onReplaceImage, onRemove }) => {
    if (variants.length === 0) {
        return (
            <Alert variant="warning" className="mt-3">
                At least one variant is required
            </Alert>
        );
    }

    return (
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
                    {variants.map((variant, index) => (
                        <VariantRow
                            key={variant.id}
                            variant={variant}
                            index={index}
                            onReplaceImage={onReplaceImage}
                            onRemove={onRemove}
                        />
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default VariantList;