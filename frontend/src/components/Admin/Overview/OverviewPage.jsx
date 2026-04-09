import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { useProductContext } from '../../../Context/Product.jsx';
import { IoWarning } from "react-icons/io5";
// import { FaCartShopping } from "react-icons/fa6";
import { AiOutlineStock } from "react-icons/ai";
import { BiSolidPackage } from "react-icons/bi";
import './OverviewPage.css';
import '../Products/Products.css';

const OverviewPage = () => {
    const { products, loading, error, getAllProducts } = useProductContext();

    const getTotalStock = (variants) =>
        variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

    const getPriceAfterDiscount = (product) => {
        if (product.sale_price)
            return `$${parseFloat(product.sale_price).toFixed(2)}`;
        if (product.sale_percentage) {
            const discounted = product.price - (product.price * product.sale_percentage) / 100;
            return `$${discounted.toFixed(2)}`;
        }
        return `$${parseFloat(product.price).toFixed(2)}`;
    };

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + getTotalStock(p.variants), 0);


    // Calculate out of stock and low stock items
    const outOfStock = products.filter((p) => getTotalStock(p.variants) === 0).length;
    const lowStockItems = products.filter((p) => {
        const stock = getTotalStock(p.variants);
        return stock > 0 && stock <= 5;
    }).length;

    // out of stock + low stock
    const needAttention = outOfStock + lowStockItems;

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
            {/* 4 stat cards */}
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
            </Row>

            {/* Products table */}
            {products.length === 0 ? (
                <Alert variant="info">
                    No products found. Go to <strong>Products</strong> to add one.
                </Alert>
            ) : (
                <div className="plant-table-wrap">

                    {/* Top bar */}
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

                    {/* table */}
                    <div className="plant-table-scroll">
                        <table className="plant-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Product</th>
                                    <th>Labels</th>
                                    <th>Category</th>
                                    <th>Size</th>
                                    <th>Price</th>
                                    <th>Variants</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => {
                                    const stock = getTotalStock(product.variants);
                                    const isOut = stock === 0;
                                    const isLow = !isOut && stock <= 5;

                                    return (
                                        <tr
                                            key={product.id}
                                            className={`plant-row ${isOut ? 'plant-row--out' : isLow ? 'plant-row--low' : ''}`}>

                                            <td></td>

                                            {/* Title + ID + date */}
                                            <td className="plant-cell-product">
                                                <div className="plant-product-title">{product.title}</div>
                                                <div className="plant-product-id"># {product.id}</div>
                                                {product.date_added && (
                                                    <div className="plant-product-date">
                                                        Added {new Date(product.date_added).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Labels */}
                                            <td>
                                                <div className="plant-badges">
                                                    {product.label && (
                                                        <span className="plant-badge plant-badge--label">{product.label}</span>
                                                    )}
                                                    {product.sale_percentage && (
                                                        <span className="plant-badge plant-badge--sale">{product.sale_percentage}% OFF</span>
                                                    )}
                                                    {product.is_bundle && (
                                                        <span className="plant-badge plant-badge--bundle">Bundle</span>
                                                    )}
                                                    {!product.label && !product.sale_percentage && !product.is_bundle && (
                                                        <span>—</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td>
                                                <span className="plant-category">{product.category?.name ?? "—"}</span>
                                            </td>

                                            {/* Size */}
                                            <td>
                                                <span className="plant-size">{product.size}</span>
                                            </td>

                                            {/* Combined price cell*/}
                                            <td className="plant-cell-price">
                                                <div className="plant-price-final">
                                                    {getPriceAfterDiscount(product)}
                                                </div>

                                                {product.sale_price && (
                                                    <div className="plant-price-meta">
                                                        <span className="plant-price-original--struck">
                                                            ${parseFloat(product.price).toFixed(2)}
                                                        </span>
                                                        <span className="plant-price-tag plant-price-tag--sale">
                                                            Sale price
                                                        </span>
                                                    </div>
                                                )}

                                                {!product.sale_price && product.sale_percentage && (
                                                    <div className="plant-price-meta">
                                                        <span className="plant-price-original--struck">
                                                            ${parseFloat(product.price).toFixed(2)}
                                                        </span>
                                                        <span className="plant-price-tag plant-price-tag--pct">
                                                            {product.sale_percentage}% off
                                                        </span>
                                                    </div>
                                                )}

                                                {!product.sale_price && !product.sale_percentage && (
                                                    <div className="plant-price-meta">
                                                        <span className="plant-price-base">Base price</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Variants */}
                                            <td>
                                                <div className="plant-variants">
                                                    {product.variants?.map((v) => (
                                                        <span
                                                            key={v.id}
                                                            className={`plant-variant ${v.stock === 0 ? 'plant-variant--out' : v.stock <= 5 ? 'plant-variant--low' : 'plant-variant--ok'}`}>
                                                            <span className="plant-variant-type">{v.type}</span>
                                                            <span className="plant-variant-stock">{v.stock}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Total stock */}
                                            <td>
                                                <div className={`plant-stock-badge plant-stock-badge--${isOut ? 'out' : isLow ? 'low' : 'ok'}`}>
                                                    {isOut
                                                        ? <><span>&#10005;</span> Out</>
                                                        : isLow
                                                            ? <><span>&#9888;</span> {stock} left</>
                                                            : <><span>&#10003;</span> {stock}</>
                                                    }
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