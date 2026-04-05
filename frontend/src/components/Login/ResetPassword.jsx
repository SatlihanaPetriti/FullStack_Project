import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword_service } from "../../Services/Auth";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (token) setShow(true);
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword_service(token, password);
            setMessage("Password changed successfully!");
            setTimeout(() => { setShow(false); navigate("/"); }, 2000);
        } catch {
            setMessage("Something went wrong.");
        }
    };

    return (
        <Modal show={show} onHide={() => navigate("/")} centered>
            <Modal.Header closeButton>
                <Modal.Title>Reset Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button className="w-100" type="submit">Reset Password</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ResetPassword;