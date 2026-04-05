import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCategoryContext } from '../../Context/Category';
import './featured_in.css';

const FeaturedSection = () => {
    const navigate = useNavigate();
    const { categories, loading } = useCategoryContext();

    if (loading) return null;

    const featured = categories.slice(0, 4);
    const hasMore = categories.length > 4;

    return (
        <Container fluid className='text-center pt-5 pb-5'>
            <div className='plant-intro1 mb-5'>
                <p className="plant-add1">Find your perfect plant</p>
                <h2 className='plant-title1'>Discover Your Ideal Green Companion</h2>
                <p className='plant-subtitle1'>
                    Explore plants that match your lifestyle, space, and vibe — effortlessly.
                </p>

                <Row className='justify-content-center mt-4 gx-4'>
                    {featured.map((cat) => (
                        <Col xs={12} sm={6} md={3} key={cat.id} className='mb-4'>
                            <div className='plant-card1'>
                                <img
                                    src={cat.image_url}
                                    alt={cat.name}
                                    className='plant-img1'
                                />
                                <div className='plant-overlay1'>
                                    <h5>{cat.name}</h5>
                                </div>
                                <span
                                    className='shop-now1'
                                    onClick={() => navigate(`/category/${cat.id}`)}>
                                    Shop Now
                                </span>
                            </div>
                        </Col>
                    ))}
                </Row>

                {hasMore && (
                    <div className='mt-3'>
                        <span
                            className='view-all-categories'
                            onClick={() => navigate('/categories')}
                        >
                            View all {categories.length} categories →
                        </span>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default FeaturedSection;