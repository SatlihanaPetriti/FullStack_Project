import { Container, Row, Col } from 'react-bootstrap';
import './featured_in.css';
import Logo1 from '../../assets/images/Home/brand-13.png';
import Logo2 from '../../assets/images/Home/brand-14.png';
import Logo3 from '../../assets/images/Home/brand-15.png';
import Logo4 from '../../assets/images/Home/brand-16.png';

const FeaturedSection = () => {
    return (
        <Container fluid className='text-center pt-5 pb-5'>
            <div className='featured-title mb-5'>
                AS FEATURED IN
            </div>
            <Row className=' feature-logo  gx-4 align-items-center'>
                <Col xs={6} md={6} lg={3} className='mb-4'>
                    <img src={Logo1} alt='Logo 1' className='img-fluid' />
                </Col>

                <Col xs={6} md={6} lg={3} className='mb-4'>
                    <img src={Logo2} alt='Logo 2' className='img-fluid' />
                </Col>

                <Col xs={6} md={6} lg={3} className='mb-4'>
                    <img src={Logo3} alt='Logo 3' className='img-fluid' />
                </Col>

                <Col xs={6} md={6} lg={3} >
                    <img src={Logo4} alt='Logo 4' className='img-fluid' />
                </Col>
            </Row>


        </Container>

    );
};

export default FeaturedSection;
