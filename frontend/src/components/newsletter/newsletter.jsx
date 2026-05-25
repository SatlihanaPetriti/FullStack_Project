import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { LeafFill } from "react-bootstrap-icons";
import { useNewsletter } from "../../Context/NewsletterContext";
import './newsletter.css';

function SubscribeModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const { status, errorMsg, subscribe, reset } = useNewsletter();

  useEffect(() => { 
    setShow(true); }, []);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => { 
        setShow(false); 
        reset(); }, 3000);
      return () => 
        clearTimeout(timer);
    }
  }, [status]);

  const handleClose = () => { 
    reset(); 
    setShow(false); };

  const handleSubmit = () => {
    subscribe(email);
    setEmail("");
  };

  return (
    <>
      <Button variant="primary" className="subscribe-button" onClick={() => setShow(true)}>
        Subscribe
      </Button>

      <Modal
        show={show} onHide={handleClose} backdrop="static" keyboard={false} centered
        className="modal-newsletter">
        <div className="modal-content">
          <Modal.Header closeButton className="modal-header" />
          <div className="modal-icon">
            <LeafFill size={45} />
          </div>

          <Modal.Body className="modal-body">
            <h2 className="modal-title">Join the Green Scene</h2>
            <p className="modal-description">
              Weekly plant care tips and exclusive offers,
              delivered to your inbox.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              className="modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={status === "loading" || status === "success"}
            />

            {status === "error" && (
              <p className="modal-error">{errorMsg}</p>
            )}

            <Button
              className="modal-grow"
              onClick={handleSubmit}
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "Sending..." : "Grow with us"}
            </Button>

            {status === "success" && (
              <p className="modal-sub">Thank you for subscribing! 🌿</p>
            )}

            <p className="modal-consent">
              By signing up, you agree to receive marketing emails.
              <Button variant="light" className="modal-nothanks" onClick={handleClose}>
                No, thanks
              </Button>
            </p>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
}

export default SubscribeModal;