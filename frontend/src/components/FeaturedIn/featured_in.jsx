import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './featured_in.css';

// 🌿 Category Images
import IndoorImg from '../../assets/images/Home/gallery-plant-8.jpg';
import OutdoorImg from '../../assets/images/Home/gallery-plant-2.jpg';
import PetImg from '../../assets/images//Home/friendly_plant.jpg';
import FloweryImg from '../../assets/images//Home/flower.jpg';

const FeaturedSection = () => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Indoor', img: IndoorImg, path: '/indoor-plants' },
        { name: 'Outdoor', img: OutdoorImg, path: '/outdoor' },
        { name: 'Pet Friendly', img: PetImg, path: '/pet-friendly' },
        { name: 'Flowery', img: FloweryImg, path: '/flowery' },
    ];

    return (
        <Container fluid className='text-center pt-5 pb-5'>

            <div className='plant-intro1 mb-5'>
                <p className="plant-add1">Find your perfect plant</p>
                <h2 className='plant-title1'>Discover Your Ideal Green Companion</h2>
                <p className='plant-subtitle1'>
                    Explore plants that match your lifestyle, space, and vibe — effortlessly.
                </p>

                <Row className='justify-content-center mt-4 gx-4'>
                    {categories.map((cat, index) => (
                        <Col xs={12} sm={6} md={3} key={index} className='mb-4'>
                            <div className='plant-card1'>
                                <img src={cat.img} alt={cat.name} className='plant-img1' />

                                {/* Bottom overlay with category name */}
                                <div className='plant-overlay1'>
                                    <h5>{cat.name}</h5>
                                </div>

                                {/* Centered hover "Shop Now" button */}
                                <span
                                    className='shop-now1'
                                    onClick={() => navigate(cat.path)}>
                                    Shop Now
                                </span>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

        </Container>
    );
};

export default FeaturedSection;