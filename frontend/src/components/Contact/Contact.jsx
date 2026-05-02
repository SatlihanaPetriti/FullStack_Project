import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { GeoAlt, Telephone, Envelope, ArrowRight, Lock } from "react-bootstrap-icons";
import "./Contact.css";

const INFO_ITEMS = [
  { icon: <GeoAlt size={14} color="#a3c4b0" />, label: "Visit us", value: "14 Fernwood Lane, Portland OR" },
  { icon: <Telephone size={14} color="#a3c4b0" />, label: "Call us", value: "+1 (503) 864 2291" },
  { icon: <Envelope size={14} color="#a3c4b0" />, label: "Email",   value: "hello@leafandroot.com" },
];

export default function Contact() {
  return (
    <div className="contact-page">
      <Container fluid className="p-0">
        <Row className="g-0">

          {/* ── LEFT PANEL ── */}
          <Col lg={5} className="contact-panel-left">
            <div className="panel-inner">
              <p className="eyebrow">Get in touch</p>
              <h1 className="panel-heading">
                Let's grow<br />
                <em>something</em><br />
                together.
              </h1>
              <p className="panel-desc">
                Whether you're searching for the perfect plant or need expert
                care guidance, our team of botanists is always here to help
                your space thrive.
              </p>
              <ul className="info-list">
                {INFO_ITEMS.map(({ icon, label, value }) => (
                  <li key={label} className="info-item">
                    <div className="info-icon-wrap">{icon}</div>
                    <div>
                      <p className="info-label">{label}</p>
                      <p className="info-value">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* ── RIGHT PANEL ── */}
          <Col lg={7} className="contact-panel-right">
            <div className="form-inner">
              <p className="form-section-title">
                Fill out the form and we'll be in touch within 24 hours.
              </p>

              <Form noValidate onSubmit={e => e.preventDefault()}>

                <Row className="g-4 mb-4">
                  <Col sm={6}>
                    <Form.Group controlId="firstName">
                      <Form.Label className="field-label">First name</Form.Label>
                      <Form.Control className="contact-input" type="text" placeholder="Ada" />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="lastName">
                      <Form.Label className="field-label">Last name</Form.Label>
                      <Form.Control className="contact-input" type="text" placeholder="Lovelace" />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="email" className="mb-4">
                  <Form.Label className="field-label">Email address</Form.Label>
                  <Form.Control className="contact-input" type="email" placeholder="ada@example.com" />
                </Form.Group>

                <Form.Group controlId="phone" className="mb-4">
                  <Form.Label className="field-label">Phone (optional)</Form.Label>
                  <Form.Control className="contact-input" type="tel" placeholder="+1 (000) 000 0000" />
                </Form.Group>

                <Form.Group controlId="message" className="mb-0">
                  <Form.Label className="field-label">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    className="contact-textarea"
                    placeholder="Tell us what's on your mind…"
                  />
                </Form.Group>

                <Button type="submit" className="submit-btn mt-5">
                  <span>Send message</span>
                  <ArrowRight size={15} className="btn-arrow" />
                </Button>

                <p className="privacy-note">
                  <Lock size={11} color="#a09a92" />
                  Your information is private and never shared.
                </p>

              </Form>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
}