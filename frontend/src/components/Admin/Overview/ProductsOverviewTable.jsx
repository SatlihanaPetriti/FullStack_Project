import { Alert } from "react-bootstrap";

const ProductsOverviewTable = ({
    products,
    totalStock,
    lowStock,
    outOfStock,
}) => {
    const getStockStatus = (stock) => {
        if (stock === 0) return "out";
        if (stock <= 5) return "low";

        return "ok";
    };

    const getRowClass = (stockStatus) => {
        if (stockStatus === "out") return "plant-row--out";
        if (stockStatus === "low") return "plant-row--low";

        return "";
    };

    const renderStockLabel = (stock, stockStatus) => {
        if (stockStatus === "out") {
            return (
                <>
                    <span>&#10005;</span> Out
                </>
            );
        }

        if (stockStatus === "low") {
            return (
                <>
                    <span>&#9888;</span> {stock} left
                </>
            );
        }

        return (
            <>
                <span>&#10003;</span> {stock}
            </>
        );
    };

    if (products.length === 0) {
        return (
            <Alert variant="info">
                No products found. Go to <strong>Products</strong> to add one.
            </Alert>
        );
    }

    return (
        <div className="plant-table-wrap">
            <div className="plant-table-topbar">
                <span className="plant-table-title">
                    Product Catalogue
                </span>

                <div className="plant-table-topbar-stats">
                    <span className="plant-stat">
                        <span className="plant-stat-num">
                            {products.length}
                        </span>{" "}
                        products
                    </span>

                    <span className="plant-stat">
                        <span className="plant-stat-num">
                            {totalStock}
                        </span>{" "}
                        units
                    </span>

                    {lowStock > 0 && (
                        <span className="plant-stat plant-stat--warn">
                            <span className="plant-stat-num">
                                {lowStock}
                            </span>{" "}
                            low stock
                        </span>
                    )}

                    {outOfStock > 0 && (
                        <span className="plant-stat plant-stat--warn">
                            <span className="plant-stat-num">
                                {outOfStock}
                            </span>{" "}
                            out of stock
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
                            const stockStatus = getStockStatus(stock);

                            return (
                                <tr
                                    key={product.id}
                                    className={`plant-row ${getRowClass(
                                        stockStatus
                                    )}`}
                                >
                                    <td className="plant-cell-product">
                                        <div className="plant-product-title">
                                            {product.title}
                                        </div>

                                        <div className="plant-product-id">
                                            # {product.id}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="plant-badges">
                                            {product.label && (
                                                <span className="plant-badge plant-badge--label">
                                                    {product.label}
                                                </span>
                                            )}

                                            {product.sale_percentage && (
                                                <span className="plant-badge plant-badge--sale">
                                                    {product.sale_percentage}% OFF
                                                </span>
                                            )}

                                            {!product.label &&
                                                !product.sale_percentage && (
                                                    <span>—</span>
                                                )}
                                        </div>
                                    </td>

                                    <td>
                                        <span className="plant-category">
                                            {product.category?.name ?? "—"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="plant-size">
                                            {product.size}
                                        </span>
                                    </td>

                                    <td className="plant-cell-price">
                                        <div className="plant-price-final">
                                            ${Number(product.price).toFixed(2)}
                                        </div>
                                    </td>

                                    <td>
                                        <div
                                            className={`plant-stock-badge plant-stock-badge--${stockStatus}`}
                                        >
                                            {renderStockLabel(
                                                stock,
                                                stockStatus
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsOverviewTable;