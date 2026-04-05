import { Modal, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { forgotPassword_service } from "../../Services/Auth";

const ForgotPassword = ({ show, handleClose }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await forgotPassword_service(email);
            setMessage(result.data.message);
            setError("");
        } catch (err) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Forgot Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button className="w-100" type="submit">
                        Send Reset Link
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ForgotPassword;