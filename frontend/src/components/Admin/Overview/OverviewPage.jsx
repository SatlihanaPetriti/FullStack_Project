import { useEffect } from "react";
import {
    Container, Row, Col,
    Card,
    Alert,
    Spinner,
    Button,
} from "react-bootstrap";

import { IoWarning } from "react-icons/io5";
import { AiOutlineStock } from "react-icons/ai";
import { BiSolidPackage } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";

import { useProductContext } from "../../../Context/Product.jsx";
import { useOrderContext } from "../../../Context/OrderContext.jsx";

import ProductsOverviewTable from "./ProductsOverviewTable";

import "./OverviewPage.css";
import "../Products/Products.css";

const OverviewPage = () => {
    const { products, loading, error, getAllProducts } = useProductContext();
    const { adminOrders, getAllOrders } = useOrderContext();

    useEffect(() => {
        getAllOrders();
    }, []);

    const stats = {
        totalProducts: products.length,

        totalStock: products.reduce(
            (total, product) => total + (product.stock || 0),
            0
        ),

        lowStock: products.filter(
            (product) =>
                (product.stock || 0) > 0 &&
                (product.stock || 0) <= 5
        ).length,

        outOfStock: products.filter(
            (product) => (product.stock || 0) === 0
        ).length,

        completedOrders: adminOrders.filter(
            (order) => order.status === "completed"
        ).length,
    };

    const needAttention = stats.lowStock + stats.outOfStock;

    const retryProducts = () => {
        getAllProducts();
    };

    if (loading && products.length === 0) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-muted">Loading...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="p-4">
                <Alert variant="danger">
                    {error}

                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-3"
                        onClick={retryProducts}
                    >
                        Try Again
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4">
            <h2 className="ov-page-title">Overview</h2>

            <Row className="g-3 mb-4">
                <Col xs={6} md={3}>
                    <Card className="ov-card ov-card--total">
                        <Card.Body className="ov-card-body">
                            <BiSolidPackage
                                size={52}
                                color="#1b4332"
                                className="ov-card-icon"
                            />

                            <div className="ov-card-num">
                                {stats.totalProducts}
                            </div>

                            <div className="ov-card-label">
                                Total Products
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={6} md={3}>
                    <Card className="ov-card ov-card--stock">
                        <Card.Body className="ov-card-body">
                            <AiOutlineStock
                                size={52}
                                color="#1b4332"
                                className="ov-card-icon"
                            />

                            <div className="ov-card-num">
                                {stats.totalStock}
                            </div>

                            <div className="ov-card-label">
                                Items in Stock
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={6} md={3}>
                    <Card className="ov-card ov-card--low">
                        <Card.Body className="ov-card-body">
                            <IoWarning
                                size={52}
                                color="#dc3545"
                                className="ov-card-icon"
                            />

                            <div className="ov-card-num">
                                {needAttention}
                            </div>

                            <div className="ov-card-label">
                                Need Attention
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={6} md={3}>
                    <Card className="ov-card ov-card--completed">
                        <Card.Body className="ov-card-body">
                            <BsCheckCircle
                                size={52}
                                color="#065F46"
                                className="ov-card-icon"
                            />

                            <div className="ov-card-num">
                                {stats.completedOrders}
                            </div>

                            <div className="ov-card-label">
                                Completed Orders
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <ProductsOverviewTable
                products={products}
                totalStock={stats.totalStock}
                lowStock={stats.lowStock}
                outOfStock={stats.outOfStock}
            />
        </Container>
    );
};

export default OverviewPage;