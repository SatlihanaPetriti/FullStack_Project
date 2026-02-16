import { Container, Row, Col, Button } from 'react-bootstrap';
import './index.css';
import '../../Pages/Home/index.css';
import c1 from '../../assets/images/Home/collection-plant-4.jpg';
import c2 from '../../assets/images/Home/collection-plant-2.jpg';
import c3 from '../../assets/images/Home/collection-plant-5.jpg';
const HomeBody = () => {
    return (
        <section className='body-section'>
            <Container >
                <Row>
                    <Col xs={12} md={4} lg={4}>
                        <div className='img-circle'>
                            <img src={c1} alt='circle 1' />
                        </div>
                        <h2 className='text-center'>
                            Heading
                        </h2>
                        <p className='text-center'>
                            Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod.
                            Nullam id dolor id nibh ultricies vehicula ut id elit.
                            Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                            Praesent commodo cursus magna.
                        </p>
                        <div className='text-center py-2'>
                            <Button variant='success' className='btn btn-secondary'>View Details</Button>
                        </div>                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div className='img-circle'>
                            <img src={c2} alt='circle 2' />
                        </div>
                        <h2 className='text-center'>
                            Heading
                        </h2>
                        <p className='text-center'>
                            Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod.
                            Nullam id dolor id nibh ultricies vehicula ut id elit.
                            Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                            Praesent commodo cursus magna.
                        </p>
                        <div className='text-center py-2'>
                            <Button variant='success' className='btn btn-secondary'>View Details</Button>
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div className='img-circle'>
                            <img src={c3} alt='circle 3' />
                        </div>
                        <h2 className='text-center'>
                            Heading
                        </h2 >
                        <p className='text-center '>
                            Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod.
                            Nullam id dolor id nibh ultricies vehicula ut id elit.
                            Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                            Praesent commodo cursus magna.
                        </p>
                        <div className='text-center py-2'>
                            <Button variant='success' className='btn btn-secondary'>View Details</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
export default HomeBody;

