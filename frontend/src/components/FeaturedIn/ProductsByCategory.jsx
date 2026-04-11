import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlantCard from '../IndoorPlants/plantcard';
import { Container, Row, Col } from 'react-bootstrap';
import { useCategoryContext } from '../../Context/Category';
import './ProductsByCategory.css';


const CategoryProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getAllProductsByCategory, getCategoryById, categories } = useCategoryContext();

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const cat = await getCategoryById(id);
            const prod = await getAllProductsByCategory(id);
            setCategory(cat);
            setProducts(prod || []);
        };

        getData();
    }, [id]);

    return (
        <div className="cp-page">
            <div
                className="cp-hero"
                style={{
                    backgroundImage: category?.image_url
                        ? `url(${category.image_url})`
                        : undefined
                }}
            >
                <div className="cp-hero__overlay" />

                <div className="cp-hero__content">
                    <span className="cp-hero__eyebrow">Category</span>

                    <h1 className="cp-hero__title">
                        {category?.name}
                    </h1>

                    <p className="cp-hero__count">
                        {products.length}{' '}
                        {products.length === 1 ? 'plant' : 'plants'} available
                    </p>
                </div>
            </div>
            {categories.length > 1 && (
                <div className="cp-cats-bar">
                    <Container fluid="lg">
                        <div className="cp-cats-bar__inner">
                            <span className="cp-cats-bar__label">
                                Browse:
                            </span>

                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`cp-cats-bar__chip ${String(cat.id) === String(id) ? 'active' : ''
                                        }`}
                                    onClick={() => navigate(`/category/${cat.id}`)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </Container>
                </div>
            )}
            <Container fluid="lg" className="cp-grid-section">
                {products.length === 0 ? (
                    <div className="cp-empty">
                        <h3>No plants here yet</h3>
                        <p>Check back soon — more greenery is on the way.</p>
                        <button
                            className="cp-empty__btn"
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <Row className="gx-3 gy-4">
                        {products.map((product) => (
                            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                                <PlantCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}

            </Container>

        </div>
    );
};

export default CategoryProducts;