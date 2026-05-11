import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddStock = ({ show, product, onClose, onAddStock }) => {
    const [stockToAdd, setStockToAdd] = useState("");

    const handleSubmit = async () => {
        const amount = Number(stockToAdd);
        await onAddStock({
            id: product.id,
            stock: amount,
        });
        setStockToAdd("");
        onClose();
    };

    const handleClose = () => {
        setStockToAdd("");
        onClose();
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered size="sm">
            <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: "15px" }}>
                    Update Stock
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p
                    className="text-muted mb-3"
                    style={{ fontSize: "15px" }}
                >
                    <strong>{product?.title}</strong> — current stock:{" "}
                    <strong>{product?.stock ?? 0}</strong>
                </p>

                <Form.Group>
                    <Form.Label style={{ fontSize: "0.875rem" }}>
                        Units to add
                    </Form.Label>

                    <Form.Control
                        type="number"
                        min={1}
                        value={stockToAdd}
                        onChange={(e) => setStockToAdd(e.target.value)}
                        placeholder="for example: 10"
                        autoFocus
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleSubmit()
                        }
                    />
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="success"
                    size="sm"
                    onClick={handleSubmit}
                >
                    Add Stock
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddStock;