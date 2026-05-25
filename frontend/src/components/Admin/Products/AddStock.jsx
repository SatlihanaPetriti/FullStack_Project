import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

const AddStock = ({ show, product, onClose, onAddStock }) => {
    const [stockToAdd, setStockToAdd] = useState("");
    const [error, setError] = useState("");

    const resetForm = () => {
        setStockToAdd("");
        setError("");
    };

    const closeModal = () => {
        resetForm();
        onClose();
    };

    const handleChange = (e) => {
        setStockToAdd(e.target.value);
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async () => {
        const amount = Number(stockToAdd);

        if (!amount || amount <= 0) {
            setError("Please enter a number bigger than 0.");
            return;
        }

        await onAddStock({
            id: product.id,
            stock: amount,
        });

        closeModal();
    };

    return (
        <Modal
            show={show}
            onHide={closeModal}
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
                        onChange={(e) => {
                            setStockToAdd(e.target.value);
                            setError("");
                        }}
                        placeholder="for example: 10"
                        autoFocus
                        isInvalid={!!error}
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleSubmit()
                        }
                    />
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={closeModal}
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