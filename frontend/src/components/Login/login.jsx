import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import "./login.css";
import { EyeFill, EyeSlashFill, Google, Apple } from "react-bootstrap-icons";
import { useState } from "react";
const Login = ({ show, handleClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      fullscreen
      centered
      className="login-fullscreen"
    >
      <Modal.Body className="p-0">
        <Row className="g-0 h-100">

          {/* LEFT SIDE IMAGE */}
          <Col md={6} className="login-image"></Col>

          {/* RIGHT SIDE LOGIN */}
          <Col md={6} className="login-panel">
            <div className="login-container">

              <button className="close-btn" onClick={handleClose}>
                ✕
              </button>

              <h2>{isSignup ? "Create an Account" : "Welcome Back!"}</h2>
              <p className="login-subtitle">
                {isSignup 
                ? "Sign up to start exploring plants"
                : "Log in to continue exploring plants"}
                </p>
              <Form>
                  {isSignup && (
                    <Form.Group className="mb-3">
                      <Form.Control
                      type="text"
                      placeholder="Full name"
                      className="login-input"/>
                      </Form.Group>)}

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    className="login-input"
                  />
                </Form.Group>

               <Form.Group className={`${isSignup ? "mb-3" : "mb-1"} position-relative`}>
                 <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="login-input"/>
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeSlashFill /> : <EyeFill />}
                </span>
              </Form.Group>

                {!isSignup && (
                  <div className="login-options">
                    <Form.Check label="Remember me" />
                    <a href="#">Forgot password?</a>
                    </div>)}

                <Button className="login-btn w-100">
                 {isSignup ? "Sign Up" : "Log In"}
                </Button>

                <div className="divider">
                  <span>or</span>
                </div>

                <Button className="social-btn w-100">
                   <Google size={24} className="social-icon"/>
                  <span className="social-text">Continue with Google</span>
                </Button>

                <Button className="social-btn w-100 mt-3">
                  <Apple size={24} className="social-icon" />
                  <span className="social-text">Continue with Apple</span>
                </Button>
                <p className="signup-link">
                  {isSignup ? "Already have an account?" : "Don't have an account?"}
                  <span className="toggle-auth" onClick={()=> setIsSignup(!isSignup)}>
                  {isSignup ? "Log in" : "Sign up"}
                  </span>
                </p>
              </Form>
            </div>
          </Col>

        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Login;