import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../Context/CartContext";
import { useProductContext } from "../../Context/Product";
import { useCategoryContext } from "../../Context/Category";

const ITEM_HEIGHT = 88;
const MAX_VISIBLE = 4;
const BASE_URL = `${import.meta.env.REACT_APP_BACKEND_URL}/products/uploads/variants`;

const CartDrawer = ({ show, onClose }) => {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart } = useCartContext();
    const { products } = useProductContext();
    const [qty, setQty] = useState(1);
    const { categories } = useCategoryContext();
    const [atBottom, setAtBottom] = useState(false);

    if (!show) return null;

    const items = cart?.items ?? [];
    const total = cart?.total_price ?? 0;
    const count = cart?.total_quantity ?? 0;
    const needsScroll = items.length > MAX_VISIBLE;

    const getFullProduct = (item) => {
        return products.find(p => p.id === item.product_id) ?? item.product;
    };

    const getImage = (item) => {
        const product = getFullProduct(item);
        const image = product?.variants?.find(v => v.image)?.image;
        return image ? `${BASE_URL}/${image}` : null;
    };

    const getCategoryName = (item) => {
        const product = getFullProduct(item);
        const catId = product?.category_id;
        const found = categories.find(c => c.id === catId);
        return found?.name ?? "";
    };

    const getSize = (item) => {
        const product = getFullProduct(item);
        return product?.size ?? null;
    };

    const handleScroll = (e) => {
        const el = e.currentTarget;
        setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
    };

    const handleMinus = (item) => {
        if (item.quantity === 1) removeFromCart(item.id);
        else updateQuantity(item.id, item.quantity - 1);
    };

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="drw-head">
                    <div className="drw-top-row">
                        <div>
                            <p className="drw-brand">Plant Shop</p>
                            <h2 className="drw-name">Cart</h2>
                        </div>
                        <button className="close-x" onClick={onClose}>✕</button>
                    </div>
                    <div className="draw-divider" />
                    <div className="draw-totrow">
                        <div>
                            <p className="draw-tot-lbl">Total</p>
                            <span className="draw-count">{count} item{count !== 1 ? "s" : ""}</span>
                        </div>
                        <p className="draw-tot-val">$ {Number(total).toFixed(2)}</p>
                    </div>
                </div>

                {/* Items */}
                <div
                    className="items-scroll"
                    style={{ maxHeight: needsScroll ? `${ITEM_HEIGHT * MAX_VISIBLE}px` : "none" }}
                    onScroll={handleScroll}
                >
                    {items.length === 0 ? (
                        <p className="empty-state">Your cart is empty</p>
                    ) : (
                        items.map(item => {
                            const image = getImage(item);
                            const categoryName = getCategoryName(item);
                            const size = getSize(item);

                            return (
                                <div key={item.id} className="item">
                                    <div className="img-wrap">
                                        {image
                                            ? <img className="item-img" src={image} alt={getFullProduct(item)?.title} />
                                            : <div className="item-img item-img--placeholder" />
                                        }
                                        <button className="rm-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                                    </div>
                                    <div className="item-body">
                                        <span className="item-cat">
                                            {categoryName}{size ? ` / ${size}` : ""}
                                        </span>
                                        <div className="item-name-row">
                                            <p className="item-name">{getFullProduct(item)?.title}</p>

                                            <div className="item-price-box">
                                                {item.quantity > 1 ? (
                                                    <>
                                                        <p className="item-price-total">
                                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                                        </p>
                                                        <p className="item-price-single">
                                                            {item.quantity} × ${Number(item.price).toFixed(2)}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="item-price-total">
                                                        ${Number(item.price).toFixed(2)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="qty-row">
                                            <button className="qb" onClick={() => handleMinus(item)}>−</button>
                                            <span className="qn">{item.quantity}</span>
                                            <button className="qb" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {needsScroll && !atBottom && (
                    <div className="scroll-hint">↓ scroll to see more</div>
                )}

                {items.length > 0 && (
                    <div className="checkout-area">
                        <button className="checkout-btn-cart" onClick={() => { navigate("/checkout"); onClose(); }}>
                            <div className="co-left">
                                <span className="co-sub">Proceed to payment</span>
                                <span className="co-main">Checkout</span>
                            </div>
                            <div className="co-arrow">→</div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;