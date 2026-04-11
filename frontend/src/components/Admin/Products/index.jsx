import { useState } from 'react';
import { GrFormEdit, GrFormTrash } from "react-icons/gr";
import { Search, Plus } from "lucide-react";
import ImageModal from "./ImageModal";
import './Products.css';

const Products = ({ products, onEdit, onDelete, onAdd }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

    const getPriceAfterDiscount = (product) => {
        if (product.sale_price)
            return `$${parseFloat(product.sale_price).toFixed(2)}`;
        if (product.sale_percentage) {
            const discounted = product.price - (product.price * product.sale_percentage) / 100;
            return `$${discounted.toFixed(2)}`;
        }
        return `$${parseFloat(product.price).toFixed(2)}`;
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await onDelete(id);
        } catch (err) {
            alert("Failed to delete product.");
        }
    };

    const handleViewImages = (product) => {
        setSelectedProductId(product.id);
        setShowImageModal(true);
    };

    const handleCloseModal = () => {
        setShowImageModal(false);
        setSelectedProductId(null);
    };

    const filteredProducts = products.filter(product => {
        const lower = searchTerm.toLowerCase();
        return (
            product.title.toLowerCase().includes(lower) ||
            product.id.toString().includes(lower)
        );
    });

    const totalUnits = products.reduce((s, p) => s + (p.stock || 0), 0);
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const onSale = products.filter(p => p.sale_price || p.sale_percentage).length;

    return (
        <div className="plant-table-wrap">

            {/* Top Bar */}
            <div className="plant-table-topbar">
                <span className="plant-table-title">Product Catalogue</span>

                <div className="plant-table-topbar-stats">
                    <span className="plant-stat">
                        <span className="plant-stat-num">{products.length}</span> products
                    </span>

                    <span className="plant-stat">
                        <span className="plant-stat-num">{totalUnits}</span> units
                    </span>

                    <span className="plant-stat plant-stat--sale">
                        <span className="plant-stat-num">{onSale}</span> on sale
                    </span>

                    {outOfStock > 0 && (
                        <span className="plant-stat plant-stat--warn">
                            <span className="plant-stat-num">{outOfStock}</span> out of stock
                        </span>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="plant-toolbar">
                <div className="plant-search-wrap">
                    <Search size={15} className="plant-search-icon" />
                    <input
                        className="plant-search-input"
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="plant-btn-add" onClick={onAdd}>
                    <Plus size={15} />
                    Add Product
                </button>
            </div>

            {/* Table */}
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
                            const isOut = stock === 0;
                            const isLow = stock > 0 && stock <= 5;

                            return (
                                <tr
                                    key={product.id}
                                    className={`plant-row ${isOut ? 'plant-row--out' : isLow ? 'plant-row--low' : ''}`}
                                >

                                    <td></td>

                                    {/* PRODUCT */}
                                    <td className="plant-cell-product">
                                        <div className="plant-product-title">{product.title}</div>
                                        <div className="plant-product-id"># {product.id}</div>
                                        {product.date_added && (
                                            <div className="plant-product-date">
                                                Added {new Date(product.date_added).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        )}
                                    </td>

                                    {/* LABELS */}
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
                                            {product.is_bundle && (
                                                <span className="plant-badge plant-badge--bundle">
                                                    Bundle
                                                </span>
                                            )}
                                            {!product.label && !product.sale_percentage && !product.is_bundle && (
                                                <span>—</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* CATEGORY */}
                                    <td>
                                        <span className="plant-category">
                                            {product.category?.name ?? product.category_id}
                                        </span>
                                    </td>

                                    {/* SIZE */}
                                    <td>
                                        <span className="plant-size">{product.size}</span>
                                    </td>

                                    {/* PRICE */}
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

                                    {/* STOCK (ONLY product.stock) */}
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

                                    {/* IMAGES (still variants ok) */}
                                    <td>
                                        {product.variants?.some(v => v.image) ? (
                                            <button
                                                className="plant-btn-images"
                                                onClick={() => handleViewImages(product)}
                                            >
                                                {product.variants.filter(v => v.image).length} images
                                            </button>
                                        ) : (
                                            <span className="text-muted">No images</span>
                                        )}
                                    </td>

                                    {/* ACTIONS */}
                                    <td>
                                        <div className="plant-actions">
                                            <button
                                                className="plant-btn plant-btn--edit"
                                                onClick={() => onEdit(product)}
                                            >
                                                <GrFormEdit size={15} /> Edit
                                            </button>

                                            <button
                                                className="plant-btn plant-btn--delete"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <GrFormTrash size={15} /> Delete
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            );
                        })}

                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center text-muted py-4">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* IMAGE MODAL */}
            {showImageModal && selectedProduct && (
                <ImageModal
                    show={showImageModal}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                />
            )}

        </div>
    );
};

export default Products;