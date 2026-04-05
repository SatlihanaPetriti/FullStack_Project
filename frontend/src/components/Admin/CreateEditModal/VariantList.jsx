import { Table, Button, Alert, Form } from "react-bootstrap";
import { useRef } from "react";

const VariantRow = ({ variant, index, onReplaceImage, onRemove }) => {
    const fileRef = useRef();

    return (
        <tr style={{ verticalAlign: "middle" }}>

            <td style={{ width: 80 }}>
                {variant.id || <span className="text-muted">—</span>}
            </td>

            <td>{variant.type}</td>

            <td style={{ width: 90 }}>{variant.stock}</td>

            <td style={{ width: 70 }}>
                {variant.previewUrl ? (
                    <img
                        src={variant.previewUrl}
                        alt={variant.type}
                        style={{
                            width: 36,
                            height: 36,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #ddd"
                        }}
                    />
                ) : (
                    <small className="text-muted">—</small>
                )}
            </td>

            <td style={{ width: 120 }}>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    style={{ display: "none" }}
                    onChange={(e) => onReplaceImage(index, e)}
                />

                <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => fileRef.current.click()}
                >
                    Upload
                </Button>
            </td>

            <td style={{ width: 100 }}>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onRemove(index)}
                >
                    Remove
                </Button>
            </td>
        </tr>
    );
};

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
            <h6
                className="mt-4 mb-2"
                style={{
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontSize: 13,
                    fontWeight: 600
                }}
            >
                Variants List
            </h6>

            <Table hover responsive size="sm" className="align-middle">
                <thead className="text-muted" style={{ fontSize: 12 }}>
                    <tr>
                        <th style={{ width: 80 }}>ID</th>
                        <th>Type</th>
                        <th style={{ width: 90 }}>Stock</th>
                        <th style={{ width: 70 }}>Img</th>
                        <th style={{ width: 120 }}>Replace Image</th>
                        <th style={{ width: 100 }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {variants.map((variant, index) => (
                        <VariantRow
                            key={variant.id ? `existing-${variant.id}` : `new-${index}`}
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