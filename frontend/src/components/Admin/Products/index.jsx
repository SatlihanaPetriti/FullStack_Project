import { useState } from "react";
import { GrFormEdit, GrFormTrash } from "react-icons/gr";
import { Search, Plus, Warehouse } from "lucide-react";

import ImageModal from "./ImageModal";
import AddStock from "./AddStock";

import "./Products.css";

const Products = ({ products, onEdit, onDelete, onAdd, onAddStock }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockProduct, setStockProduct] = useState(null);

    const filteredProducts = products.filter((product) => {
        const search = searchTerm.toLowerCase();

        return (
            product.title.toLowerCase().includes(search) ||
            product.id.toString().includes(search)
        );
    });

    const totalUnits = products.reduce(
        (total, product) => total + (product.stock || 0),
        0
    );

    const outOfStock = products.filter(
        (product) => (product.stock || 0) === 0
    ).length;

    const onSale = products.filter(
        (product) => product.sale_percentage
    ).length;

    const getDiscountedPrice = (product) => {
        if (!product.sale_percentage) {
            return Number(product.price);
        }

        return product.price - (product.price * product.sale_percentage) / 100;
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return "out";
        if (stock <= 5) return "low";

        return "ok";
    };

    const getStockText = (stockStatus, stock) => {
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

    const getProductImages = (product) => {
        return product.variants?.filter((variant) => variant.image) ?? [];
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const openImageModal = (product) => {
        setSelectedProduct(product);
    };

    const closeImageModal = () => {
        setSelectedProduct(null);
    };

    const openStockModal = (product) => {
        setStockProduct(product);
    };

    const closeStockModal = () => {
        setStockProduct(null);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await onDelete(id);
        } catch {
            alert("Failed to delete product.");
        }
    };

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
                            {totalUnits}
                        </span>{" "}
                        units
                    </span>

                    <span className="plant-stat plant-stat--sale">
                        <span className="plant-stat-num">
                            {onSale}
                        </span>{" "}
                        on sale
                    </span>

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

            <div className="plant-toolbar">
                <div className="plant-search-wrap">
                    <Search size={15} className="plant-search-icon" />

                    <input
                        className="plant-search-input"
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="plant-btn-add" onClick={onAdd}>
                    <Plus size={15} />
                    Add Product
                </button>
            </div>

            <div className="plant-table-container">
                <table className="plant-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Product</th>
                            <th>Labels</th>
                            <th>Category</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Images</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((product) => {
                            const stock = product.stock || 0;
                            const stockStatus = getStockStatus(stock);
                            const images = getProductImages(product);
                            const discountedPrice = getDiscountedPrice(product);

                            return (
                                <tr
                                    key={product.id}
                                    className={`plant-row ${stockStatus === "out"
                                        ? "plant-row--out"
                                        : stockStatus === "low"
                                            ? "plant-row--low"
                                            : ""
                                        }`}
                                >
                                    <td></td>

                                    <td className="plant-cell-product">
                                        <div className="plant-product-title">
                                            {product.title}
                                        </div>

                                        <div className="plant-product-id">
                                            # {product.id}
                                        </div>

                                        {product.date_added && (
                                            <div className="plant-product-date">
                                                Added {formatDate(product.date_added)}
                                            </div>
                                        )}
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
                                        </div>
                                    </td>

                                    <td>
                                        <span className="plant-category">
                                            {product.category?.name ??
                                                product.category_id}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="plant-size">
                                            {product.size}
                                        </span>
                                    </td>

                                    <td className="plant-cell-price">
                                        <div className="plant-price-final">
                                            ${discountedPrice.toFixed(2)}
                                        </div>

                                        {product.sale_percentage ? (
                                            <div className="plant-price-meta">
                                                <span className="plant-price-original--struck">
                                                    ${Number(product.price).toFixed(2)}
                                                </span>

                                                <span className="plant-price-tag plant-price-tag--pct">
                                                    {product.sale_percentage}% off
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="plant-price-meta">
                                                <span className="plant-price-base">
                                                    Base price
                                                </span>
                                            </div>
                                        )}
                                    </td>

                                    <td>
                                        <div
                                            className={`plant-stock-badge plant-stock-badge--${stockStatus}`}
                                        >
                                            {getStockText(stockStatus, stock)}
                                        </div>
                                    </td>

                                    <td>
                                        {images.length > 0 ? (
                                            <button
                                                className="plant-btn-images"
                                                onClick={() => openImageModal(product)}
                                            >
                                                {images.length} images
                                            </button>
                                        ) : (
                                            <span className="text-muted">
                                                No images
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <div className="plant-actions">
                                            <button
                                                className="plant-btn plant-btn--edit"
                                                onClick={() => onEdit(product)}
                                            >
                                                <GrFormEdit size={15} />
                                                Edit
                                            </button>

                                            <button
                                                className="plant-btn plant-btn--edit"
                                                onClick={() => openStockModal(product)}
                                            >
                                                <Warehouse size={15} />
                                                Update Stock
                                            </button>

                                            <button
                                                className="plant-btn plant-btn--delete"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <GrFormTrash size={15} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredProducts.length === 0 && (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="text-center text-muted py-4"
                                >
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedProduct && (
                <ImageModal
                    show={true}
                    product={selectedProduct}
                    onClose={closeImageModal}
                />
            )}

            {stockProduct && (
                <AddStock
                    show={true}
                    product={stockProduct}
                    onClose={closeStockModal}
                    onAddStock={onAddStock}
                />
            )}
        </div>
    );
};

export default Products;