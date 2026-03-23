import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {LeafFill} from"react-bootstrap-icons";
import './newsletter.css'

function SubscribeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [ submitted, setSubmitted] = useState(false);
  return (
    <>
      <Button
        variant="primary" className="subscribe-button"  onClick={handleShow}>
        Subscribe
      </Button>

      <Modal
        show={show} onHide={handleClose} backdrop="static" keyboard={false} centered
        className="modal-newsletter">
        <div className="modal-content">
        <Modal.Header closeButton className="modal-header"/>
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
          className="modal-input"/>
          
          <Button
          className="modal-grow"
          onClick={() =>{ setSubmitted(true);
            setTimeout(()=> setShow(false),3000);}}>
            Grow with us
          </Button>
            {submitted && (
    <p  className ="modal-sub">
      Thank you for subscribing! 
    </p>
  )}
  <p className="modal-consent">
  By signing up, you agree to receive marketing emails.
  <Button
  variant="light"
  className="modal-nothanks"
  onClick={handleClose}   // closes the modal
>
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