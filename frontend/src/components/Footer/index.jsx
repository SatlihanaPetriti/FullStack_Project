import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './index.css';
import visa from '../../assets/images/Home/visa.png';
import mastercard from '../../assets/images/Home/img-2.png';
import usaexpress from '../../assets/images/Home/img-1.png';
import applepay from '../../assets/images/Home/img-3.png';
import paypal from '../../assets/images/Home/img-4.png';
import '../../Pages/Home/index.css';

const FooterHome = () => {
    return (
        <footer className='footer-container mt-5'>
            <Container fluid>
                <Row>
                    {/* Help Column */}
                    <Col xs={12} md={3} className='mb-4'>
                        <h5>Help</h5>
                        <ul className='list-unstyled'>
                            <li><a href='/'>Privacy Policy</a></li>
                            <li><a href='/'>Returns + Exchanges</a></li>
                            <li><a href='/'>Shipping</a></li>
                            <li><a href='/'>Terms & Conditions</a></li>
                            <li><a href='/'>FAQ's</a></li>
                            <li><a href='/'>Compare</a></li>
                            <li><a href='/'>My Wishlist</a></li>
                        </ul>
                    </Col>

                    {/* About Us Column */}
                    <Col md={3} className='mb-4'>
                        <h5>About Us</h5>
                        <ul className='list-unstyled'>
                            <li><a href='/'>Our Story</a></li>
                            <li><a href='/'>Visit Our Store</a></li>
                            <li><a href='/'>Contact Us</a></li>
                            <li><a href='/'>Account</a></li>
                        </ul>
                    </Col>

                    {/* Find Us Column */}
                    <Col md={3} className='mb-4'>
                        <h5>Find Us</h5>
                        <ul className='list-unstyled'>
                            <li><a href='/'>Find a location nearest you.</a></li>
                            <li><a href='/'>See Our Stores</a></li>
                            <li><a href='tel:0889421299'>(08) 8942 1299</a></li>
                            <li><a href='mailto:hello@domain.com'>hello@domain.com</a></li>
                        </ul>
                        <div className='d-flex gap-2 mt-2'>
                            <a href='/'><i className='fa fa-facebook-f'></i></a>
                            <a href='/'><i className='bi bi-twitter-x'></i></a>
                            <a href='/'><i className='fa fa-instagram'></i></a>
                            <a href='/'><i className='bi bi-tiktok'></i></a>
                            <a href='/'><i className='fa fa-pinterest'></i></a>
                        </div>
                    </Col>

                    {/* Newsletter Column */}
                    <Col md={3} className=' sign-up mb-4'>
                        <h5>Sign Up for Email</h5>
                        <p>Sign up to get first dibs on new arrivals, sales, exclusive content, events and more!</p>

                        {/*  Subscription Form */}
                        <Form className='d-flex mb-3'>
                            <Form.Control
                                type='email'
                                placeholder='Enter your email...'
                                className='me-2'
                            />
                            <Button variant='success' type='submit'>Subscribe</Button>
                        </Form>

                        {/* feedback message */}
                         <p style={{ color: 'green' }}></p>

                        <Form.Select className='mb-2'>
                            <option>USD $ | United States</option>
                            <option>EUR € | France</option>
                            <option>EUR € | Germany</option>
                            <option>VND ₫ | Vietnam</option>
                        </Form.Select>
                        <Form.Select>
                            <option>English</option>
                            <option>Français</option>
                            <option>Deutsch</option>
                            <option>Pусский</option>
                        </Form.Select>
                    </Col>
                </Row>

                {/* Footer Bottom */}
                <Row className='pt-3 border-top mt-3 align-items-center'>
                    <Col md={6}>
                        <p className=' copy-rights mb-2'>&copy; 2025 Home Plant Store. All Rights Reserved</p>
                    </Col>
                    <Col md={6} className='text-md-end footer-payment-icons'>
                        <img src={visa} alt='Visa' />
                        <img src={mastercard} alt='Mastercard' />
                        <img src={usaexpress} alt='American Express' />
                        <img src={paypal} alt='PayPal' />
                        <img src={applepay} alt='Apple Pay' />
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default FooterHome;
