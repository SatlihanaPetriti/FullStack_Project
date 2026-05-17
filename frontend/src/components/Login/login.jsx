import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import "./login.css";
import { EyeFill, EyeSlashFill, Google, Apple } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import { useUserContext } from "../../Context/Auth";
import ForgotPassword from "../Login/ForgotPassword";

const Login = ({ show, handleClose, initialSignup = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const { login, register, error, setError, user } = useUserContext();

  // Kur modal hapet, sinkronizo me initialSignup
  useEffect(() => {
    if (show) setIsSignup(initialSignup);
  }, [show, initialSignup]);

  // Mbyll modal automatikisht kur useri kyçet
  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      await register({
        name: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password
      });
    } else {
      await login({
        email: data.email,
        password: data.password
      });
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        fullscreen
        centered
        className="login-fullscreen"
      >
        <Modal.Body className="p-0">
          <Row className="g-0 h-100">

            <Col md={6} className="login-image"></Col>

            <Col md={6} className="login-panel">
              <div className="login-container">
                <button className="close-btn" onClick={handleClose} aria-label="Close">&times;</button>
                <h2>{isSignup ? "Create an Account" : "Welcome Back!"}</h2>
                <p className="login-subtitle">
                  {isSignup
                    ? "Sign up to start exploring plants"
                    : "Log in to continue exploring plants"}
                </p>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <Form onSubmit={handleSubmit}>
                  {isSignup && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          className="login-input"
                          value={data.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          className="login-input"
                          value={data.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="login-input"
                      value={data.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className={`${isSignup ? "mb-3" : "mb-1"} position-relative`}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="login-input"
                      value={data.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </span>
                  </Form.Group>

                  {!isSignup && (
                    <div className="login-options">
                      <Form.Check label="Remember me" />
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <Button className="login-btn w-100" type="submit">
                    {isSignup ? "Sign Up" : "Log In"}
                  </Button>

                  <div className="divider"><span>or</span></div>

                  {/* <Button className="social-btn w-100">
                    <Google size={24} className="social-icon" />
                    <span className="social-text">Continue with Google</span>
                  </Button>

                  <Button className="social-btn w-100 mt-3">
                    <Apple size={24} className="social-icon" />
                    <span className="social-text">Continue with Apple</span>
                  </Button> */}

                  <p className="signup-link">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                    <span
                      className="toggle-auth"
                      onClick={() => {
                        setIsSignup(!isSignup);
                        setError(null);
                        setData({ firstName: "", lastName: "", email: data.email, password: data.password });
                      }}
                    >
                      {isSignup ? "Log in" : "Sign up"}
                    </span>
                  </p>
                </Form>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <ForgotPassword
        show={showForgotPassword}
        handleClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default Login;