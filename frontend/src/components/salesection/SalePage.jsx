import {
    Container,
    Row,
    Col,
    Spinner,
    Alert
} from 'react-bootstrap';

import { useProductContext } from '../../Context/Product';
import PlantCard from '../IndoorPlants/plantcard';
import './SalePage.css';

const SalePage = () => {
    const {
        products,
        loading,
        error
    } = useProductContext();

    const saleProducts = products.filter(
        (product) => product.sale_percentage
    );

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />

                <p className="mt-3">
                    Loading sale products...
                </p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <div className="sale-page">

            {/* HERO */}
            <div className="sale-hero">
                <Container fluid>
                    <h1 className="sale-hero__title">
                        Spring <em>Sale</em>
                    </h1>

                    <p className="sale-hero__sub">
                        Fresh greens, unbeatable prices — up to 20% off indoor plants
                    </p>
                </Container>
            </div>

            {/* PRODUCTS */}
            <Container fluid className="sale-body">

                {saleProducts.length === 0 ? (
                    <Alert variant="info">
                        No products are currently on sale.
                    </Alert>
                ) : (
                    <Row
                        xs={1}
                        sm={2}
                        md={3}
                        xl={4}
                        className="g-4 product-grid"
                    >
                        {saleProducts.map((product) => (
                            <Col key={product.id}>
                                <PlantCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}

            </Container>

        </div>
    );
};

export default SalePage;