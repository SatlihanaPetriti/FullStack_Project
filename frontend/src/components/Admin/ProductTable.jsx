import './ProductTable.css';
import { GrFormEdit } from "react-icons/gr";
import { GrFormTrash } from "react-icons/gr";
import { Button } from "react-bootstrap";
import { useState } from "react";
import ImageModal from "./ImageModal";

const ProductTable = ({ products, onEdit, onDelete }) => {
    const [selectedProduct, setSelectedProduct] = useState(null); // produkti qe zgjedhim per te pare imazhet
    const [showImageModal, setShowImageModal] = useState(false);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await onDelete(id);
            alert("Product deleted successfully!");
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product.");
        }
    };

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

    const handleViewImages = (product) => {
        setSelectedProduct(product);
        setShowImageModal(true);
    };
    // stats ne topbar
    const totalUnits = products.reduce((s, p) => s + getTotalStock(p.variants), 0);
    const outOfStock = products.filter(p => getTotalStock(p.variants) === 0).length;
    const onSale = products.filter(p => p.sale_price || p.sale_percentage).length;

    return (
        <div className="plant-table-wrap">

            {/* topbar */}
            <div className="plant-table-topbar">
                <span className="plant-table-title">Product Catalogue</span>
                <div className="plant-table-topbar-stats">
                    <span className="plant-stat"><span className="plant-stat-num">{products.length}</span> products</span>
                    <span className="plant-stat"><span className="plant-stat-num">{totalUnits}</span> units</span>
                    <span className="plant-stat plant-stat--sale"><span className="plant-stat-num">{onSale}</span> on sale</span>
                    {outOfStock > 0 && <>
                        <span className="plant-stat plant-stat--warn"><span className="plant-stat-num">{outOfStock}</span> out of stock</span>
                    </>}
                </div>
            </div>

            {/* table area */}
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
                            <th>Variants</th>
                            <th>Stock</th>
                            <th>Images</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => {
                            const totalStock = getTotalStock(product.variants);
                            const isOut = totalStock === 0;
                            const isLow = !isOut && totalStock <= 5;

                            return (
                                <tr
                                    key={product.id}
                                    className={`plant-row ${isOut ? 'plant-row--out' : isLow ? 'plant-row--low' : ''}`}
                                >
                                    <td></td>

                                    {/* Product ID + Title stacked */}
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
                                        <span className="plant-category">{product.category}</span>
                                    </td>

                                    {/* Size */}
                                    <td>
                                        <span className="plant-size">{product.size}</span>
                                    </td>

                                    {/* Combined price cell */}
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
                                                <span className="plant-price-base">
                                                    Base price
                                                </span>
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
                                                    <span>{v.type}</span>
                                                    <span>{v.stock}</span>
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
                                                    ? <><span>&#9888;</span> {totalStock} left</>
                                                    : <><span>&#10003;</span> {totalStock}</>
                                            }
                                        </div>
                                    </td>

                                    {/* Images column  */}
                                    <td>
                                        {/* kontrollohet nese ka te pakten nje imazh*/}
                                        {product.variants?.some(v => v.image) ? (
                                            <>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    onClick={() => handleViewImages(product)}
                                                >
                                                    {product.variants.filter(v => v.image).length} images {/* nese ka behet sa me length*/}
                                                </Button>

                                            </>
                                        ) : (
                                            <span className="text-muted">No images</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td>
                                        <div className="plant-actions">
                                            <button className="plant-btn plant-btn--edit" onClick={() => onEdit(product)}>
                                                <GrFormEdit size={15} />Edit
                                            </button>
                                            <button className="plant-btn plant-btn--delete" onClick={() => handleDelete(product.id)}>
                                                <GrFormTrash size={15} />Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Image Modal*/}
            {showImageModal && (
                <ImageModal
                    show={showImageModal}
                    onClose={() => setShowImageModal(false)}
                    product={selectedProduct}
                />
            )}
        </div>
    );
};

export default ProductTable;

// lexo ina
// 1. Kliko butonin "3 images"
// 2. setSelectedProduct(product) → selectedProduct = produkti aktual
// 3. setShowImageModal(true) → showImageModal = true
// 4. Kushti { showImageModal && ... } behet true
// 5. Modali shfaqet me produktin e zgjedhur
// 6. Kliko "Close" → onClose therret setShowImageModal(false)
// 7. Modali mbyllet