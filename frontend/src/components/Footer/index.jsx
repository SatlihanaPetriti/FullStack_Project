import { Container, Row, Col } from 'react-bootstrap';
import './index.css';
import { Instagram, Facebook, TwitterX } from 'react-bootstrap-icons';
import logow from '../../assets/images/Home/logowhite.png';

const FooterHome = () => {
    return (
        <footer className="footer-container ">

            <Container className="footer-content">

                <Row className="align-items-start">

                    {/* LEFT SIDE */}
                    
                    <Col md={4} className="footer-left">
                        <img src={logow} alt="Logo" className="footer-logo" />

                        <p className="footer-description">
                            Helping you create a greener, calmer space with hand-picked indoor plants — delivered with care and rooted in joy.
                        </p>

                        <div className="social-icons mt-3 d-flex gap-3">
                            <a href="/"><Instagram size={20} /></a>
                            <a href="/"><Facebook size={20} /></a>
                            <a href="/"><TwitterX size={20} /></a>
                        </div>
                    </Col>

                    {/* SITE MAP */}
                    <Col md={4} className="site-map mb-4">
                        <h5>Site Map</h5>
                        <ul className="list-unstyled">
                            <li><a href="/">Home</a></li>
                            <li><a href="/shop">Shop</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </Col>

                    {/* LEGAL */}
                    <Col md={4} className="legal mb-4">
                        <h5>Legal</h5>
                        <ul className="list-unstyled ">
                            <li><a href="/">Privacy Policy</a></li>
                            <li><a href="/">Terms of Service</a></li>
                            <li><a href="/">Return & Shipping</a></li>
                        </ul>
                    </Col>

                </Row>
            </Container>
            <div className="footer-bottom text-center">
                <p className="mb-0">© 2026 All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default FooterHome;