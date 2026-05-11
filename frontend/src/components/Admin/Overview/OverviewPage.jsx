import { useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap'; import { useProductContext } from '../../../Context/Product.jsx';
import { useOrderContext } from '../../../Context/OrderContext.jsx';
import { IoWarning } from "react-icons/io5";
import { AiOutlineStock } from "react-icons/ai";
import { BiSolidPackage } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import './OverviewPage.css';
import '../Products/Products.css';

const OverviewPage = () => {
    const { products, loading, error, getAllProducts } = useProductContext();
    const { adminOrders, getAllOrders } = useOrderContext();

    useEffect(() => {
        getAllOrders();
    }, []);

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockItems = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const needAttention = lowStockItems + outOfStock;
    const completedOrders = adminOrders.filter(o => o.status === 'completed').length;

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
                    <Button variant="outline-danger" size="sm" className="ms-3" onClick={getAllProducts}>
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
                            <BiSolidPackage size={52} color='#1b4332' className="ov-card-icon" />
                            <div className="ov-card-num">{totalProducts}</div>
                            <div className="ov-card-label">Total Products</div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={6} md={3}>
                    <Card className="ov-card ov-card--stock">
                        <Card.Body className="ov-card-body">
                            <AiOutlineStock size={52} color='#1b4332' className="ov-card-icon" />
                            <div className="ov-card-num">{totalStock}</div>
                            <div className="ov-card-label">Items in Stock</div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={6} md={3}>
                    <Card className="ov-card ov-card--low">
                        <Card.Body className="ov-card-body">
                            <IoWarning size={52} color="#dc3545" className="ov-card-icon" />
                            <div className="ov-card-num">{needAttention}</div>
                            <div className="ov-card-label">Need Attention</div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={6} md={3}>
                    <Card className="ov-card ov-card--completed">
                        <Card.Body className="ov-card-body">
                            <BsCheckCircle size={52} color="#065F46" className="ov-card-icon" />
                            <div className="ov-card-num">{completedOrders}</div>
                            <div className="ov-card-label">Completed Orders</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* TABLE */}
            {products.length === 0 ? (
                <Alert variant="info">
                    No products found. Go to <strong>Products</strong> to add one.
                </Alert>
            ) : (
                <div className="plant-table-wrap">
                    <div className="plant-table-topbar">
                        <span className="plant-table-title">Product Catalogue</span>
                        <div className="plant-table-topbar-stats">
                            <span className="plant-stat">
                                <span className="plant-stat-num">{products.length}</span> products
                            </span>
                            <span className="plant-stat">
                                <span className="plant-stat-num">{totalStock}</span> units
                            </span>
                            {lowStockItems > 0 && (
                                <span className="plant-stat plant-stat--warn">
                                    <span className="plant-stat-num">{lowStockItems}</span> low stock
                                </span>
                            )}
                            {outOfStock > 0 && (
                                <span className="plant-stat plant-stat--warn">
                                    <span className="plant-stat-num">{outOfStock}</span> out of stock
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="plant-table-scroll">
                        <table className="plant-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Labels</th>
                                    <th>Category</th>
                                    <th>Size</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const stock = product.stock || 0;
                                    const isOut = stock === 0;
                                    const isLow = stock > 0 && stock <= 5;

                                    return (
                                        <tr key={product.id} className={`plant-row ${isOut ? 'plant-row--out' : isLow ? 'plant-row--low' : ''}`}>
                                            <td className="plant-cell-product">
                                                <div className="plant-product-title">{product.title}</div>
                                                <div className="plant-product-id"># {product.id}</div>
                                            </td>
                                            <td>
                                                <div className="plant-badges">
                                                    {product.label && <span className="plant-badge plant-badge--label">{product.label}</span>}
                                                    {product.sale_percentage && <span className="plant-badge plant-badge--sale">{product.sale_percentage}% OFF</span>}
                                                    {product.is_bundle && <span className="plant-badge plant-badge--bundle">Bundle</span>}
                                                    {!product.label && !product.sale_percentage && !product.is_bundle && <span>—</span>}
                                                </div>
                                            </td>
                                            <td><span className="plant-category">{product.category?.name ?? "—"}</span></td>
                                            <td><span className="plant-size">{product.size}</span></td>
                                            <td className="plant-cell-price">
                                                {product.sale_price ? (
                                                    <>
                                                        <div className="plant-price-final">${parseFloat(product.sale_price).toFixed(2)}</div>
                                                        <div className="plant-price-meta">
                                                            <span className="plant-price-original--struck">${parseFloat(product.price).toFixed(2)}</span>
                                                            <span className="plant-price-tag plant-price-tag--sale">Sale price</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="plant-price-final">${parseFloat(product.price).toFixed(2)}</div>
                                                )}
                                            </td>
                                            <td>
                                                <div className={`plant-stock-badge plant-stock-badge--${isOut ? 'out' : isLow ? 'low' : 'ok'}`}>
                                                    {isOut ? <><span>&#10005;</span> Out</> : isLow ? <><span>&#9888;</span> {stock} left</> : <><span>&#10003;</span> {stock}</>}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default OverviewPage;