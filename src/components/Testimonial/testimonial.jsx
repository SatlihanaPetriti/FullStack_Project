import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { StarFill, Quote } from 'react-bootstrap-icons';
import test1 from '../../assets/images/Home/plant-testi1.jpg';
import test2 from '../../assets/images/Home/plant-testi2.jpg';
import './testimonial.css';
import '../../Pages/Home/index.css';

const TestimonialSection = () => {
  return (
    <section className='testimonial-section'>
      <Container className='edit-container py-5 px-5'>
        <Carousel controls indicators={false} interval={null}>
          {/* TESTIMONIAL 1 */}
          <Carousel.Item>
            <Row className='position-items'>
              <Col lg={7} className='text-white'>
                <div className='mb-4'>
                  <Quote size={80} color='#B5B5B5' />
                </div>
                <div className='testimonial-heading mb-3'>
                  OUR CUSTOMER'S RAVE REVIEWS
                </div>
                <div className='star-rating mb-3'>
                  <StarFill /><StarFill /><StarFill /><StarFill /><StarFill />
                </div>
                <p className='testimonial-text mt-3'>
                  I've ordered from a lot of places, a lot! and I must say that
                  this place here has the best shipping experience ever.
                  Thank you guys so much for this ♥️
                </p>

                {/* Mobile / tablet  */}
                <div className='image-author d-lg-none mt-3'>
                  <div className='image-1 image-zoom'>
                    <img src={test1} alt='Testimonial Vincent' />
                  </div>
                  <div className='author-info mt-2'>
                    <div className='author-name'>Vincent Pahm</div>
                    <div className='purchase-item'>
                      Purchase item: <span>Aglaonema Siam</span>
                    </div>
                  </div>
                </div>

                {/* Desktop author info */}
                <div className='author-info mt-5 d-none d-lg-block'>
                  <div className='author-name'>Vincent Pahm</div>
                  <div className='purchase-item'>
                    Purchase item: <span>Aglaonema Siam</span>
                  </div>
                </div>
              </Col>

              {/* Desktop image */}
              <Col lg={5} className='d-none d-lg-flex align-items-center justify-content-center'>
                <div className='image-1 image-zoom'>
                  <img src={test1} alt='Testimonial Vincent' />
                </div>
              </Col>
            </Row>
          </Carousel.Item>

          {/* TESTIMONIAL 2 */}
          <Carousel.Item>
            <Row className='position-items'>
              <Col lg={7} className='text-white'>
                <div className='mb-4'>
                  <Quote size={80} color='#B5B5B5' />
                </div>
                <div className='testimonial-heading mb-3'>
                  OUR CUSTOMER'S RAVE REVIEWS
                </div>
                <div className='star-rating mb-3'>
                  <StarFill /><StarFill /><StarFill /><StarFill /><StarFill />
                </div>
                <p className='testimonial-text mt-3'>
                  Love my new indoor plant! It arrived healthy and adds a
                  refreshing touch to my home. Super easy to care for, highly
                  recommended!
                </p>

                {/* Mobile / tablet*/}
                <div className='image-author d-lg-none mt-3'>
                  <div className='image-1 image-zoom'>
                    <img src={test2} alt='Testimonial Robert' />
                  </div>
                  <div className='author-info mt-2'>
                    <div className='author-name'>Robert Smith</div>
                    <div className='purchase-item'>
                      Purchase item: <span>Baby Stroller with Ride-Along Board</span>
                    </div>
                  </div>
                </div>

                {/* Desktop author info*/}
                <div className='author-info mt-5 d-none d-lg-block'>
                  <div className='author-name'>Robert Smith</div>
                  <div className='purchase-item'>
                    Purchase item: <span>Baby Stroller with Ride-Along Board</span>
                  </div>
                </div>
              </Col>

              {/* Desktop image */}
              <Col lg={5} className='d-none d-lg-flex align-items-center justify-content-center'>
                <div className='image-1 image-zoom'>
                  <img src={test2} alt='Testimonial Robert' />
                </div>
              </Col>
            </Row>
          </Carousel.Item>
        </Carousel>
      </Container>
    </section>
  );
};

export default TestimonialSection;