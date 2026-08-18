import { Container, Row, Col } from 'react-bootstrap';
import { useProductContext } from '../../Context/Product';
import PlantCard from '../IndoorPlants/plantcard';
import './SalePage.css';

const SalePage = () => {
    const { products, loading, error } = useProductContext();

    const saleProducts = products.filter((p) => p.sale_percentage);

    if (loading) {
        return <div className="sale-spinner" />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="sale-page">

            <div className="sale-hero">
                <h1 className="sale-hero__title">
                    Spring <em>Sale</em>
                </h1>

                <p className="sale-hero__sub">
                    Fresh greens, unbeatable prices — up to 20% off indoor plants
                </p>
            </div>

            <Container className="sale-body">
                <Row className="g-4">
                    {saleProducts.map((product) => (
                        <Col
                            key={product.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <PlantCard product={product} />
                        </Col>
                    ))}
                </Row>
            </Container>

        </div>
    );
};

export default SalePage;