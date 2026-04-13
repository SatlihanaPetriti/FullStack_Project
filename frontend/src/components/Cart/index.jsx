import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

const mockCart = [
    { product_id: 1, title: "Celosia", category: "OUTDOOR", price: 87, quantity: 1, emoji: "🪴" },
    { product_id: 2, title: "Heliconia", category: "OUTDOOR", price: 47, quantity: 1, emoji: "🌸" },
    { product_id: 3, title: "Stromanthe", category: "OUTDOOR", price: 150, quantity: 1, emoji: "🌿" },
    { product_id: 4, title: "Anthurium", category: "INDOOR", price: 65, quantity: 1, emoji: "🌺" },
    { product_id: 5, title: "Lucky Bamboo", category: "INDOOR", price: 132, quantity: 1, emoji: "🎋" },
];

const ITEM_HEIGHT = 88;
const MAX_VISIBLE = 4;

const CartDrawer = ({ show, onClose }) => {
    const navigate = useNavigate();

    const [cart, setCart] = useState(mockCart);
    const [atBottom, setAtBottom] = useState(false);

    if (!show) return null;

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const needsScroll = cart.length > MAX_VISIBLE;
    const maxHeight = needsScroll ? `${ITEM_HEIGHT * MAX_VISIBLE}px` : "none";

    const updateQty = (id, delta) =>
        setCart(prev =>
            prev
                .map(i => i.product_id === id ? { ...i, quantity: i.quantity + delta } : i)
                .filter(i => i.quantity > 0)
        );

    const handleScroll = (e) => {
        const el = e.currentTarget;
        setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
    };

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-drawer" onClick={e => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="drw-head">
                    <div className="drw-top-row">
                        <div>
                            <p className="drw-brand">Plant Shop</p>
                            <h2 className="drw-name">Cart</h2>
                        </div>
                        <button className="close-x" onClick={onClose} aria-label="Close cart">
                            <svg viewBox="0 0 11 11" width="11" height="11"
                                stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none">
                                <line x1="1.5" y1="1.5" x2="9.5" y2="9.5" />
                                <line x1="9.5" y1="1.5" x2="1.5" y2="9.5" />
                            </svg>
                        </button>
                    </div>
                    <div className="draw-divider" />
                    <div className="draw-totrow">
                        <div>
                            <p className="draw-tot-lbl">Total</p>
                            <span className="draw-count">{count} item{count !== 1 ? "s" : ""}</span>
                        </div>
                        <p className="draw-tot-val">$ {total}</p>
                    </div>
                </div>

                {/* ── Scrollable item list ── */}
                <div
                    className="items-scroll"
                    style={{ maxHeight }}
                    onScroll={handleScroll}
                >
                    <div className="items">
                        {cart.length === 0 ? (
                            <div className="empty-state">
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product_id} className="item">
                                    <div className="img-wrap">
                                        <div className="item-img">{item.emoji}</div>
                                        <button
                                            className="rm-btn"
                                            aria-label={`Remove ${item.title}`}
                                            onClick={() => updateQty(item.product_id, -item.quantity)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="item-body">
                                        <span className="item-cat">{item.category}</span>
                                        <div className="item-name-row">
                                            <p className="item-name">{item.title}</p>
                                            <p className="item-price">$ {item.price}</p>
                                        </div>
                                        <div className="qty-row">
                                            <button className="qb" onClick={() => updateQty(item.product_id, -1)}>−</button>
                                            <span className="qn">{item.quantity}</span>
                                            <button className="qb" onClick={() => updateQty(item.product_id, 1)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Scroll hint ── */}
                {needsScroll && (
                    <div className={`scroll-hint ${atBottom ? "hidden" : ""}`}>
                        ↓ scroll to see more
                    </div>
                )}

                {/* ── Checkout ── */}
                {cart.length > 0 && (
                    <div className="checkout-area">
                        <button className="checkout-btn-cart" 
                        onClick={() => navigate("/checkout")}>
                            <div className="co-left">
                                <span className="co-sub">Proceed to payment</span>
                                <span className="co-main">Checkout</span>
                            </div>
                            <div className="co-arrow">
                                <svg viewBox="0 0 14 14" width="14" height="14"
                                    stroke="#fff" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round" fill="none">
                                    <line x1="2" y1="7" x2="12" y2="7" />
                                    <polyline points="7,2 12,7 7,12" />
                                </svg>
                            </div>
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CartDrawer;