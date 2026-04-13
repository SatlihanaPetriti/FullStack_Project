import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./checkout.css";

const initialProducts = [
    {
        id: 1,
        title: "Simply Soluble Elev8 Doll CBD Bath Bomb",
        category: "Mint",
        size: "100 mg",
        price: 50,
        qty: 1,
        image: "https://placehold.co/80x80/e8e8e8/888?text=Bath",
    },
    {
        id: 2,
        title: "Water Soluble CBD Powder",
        category: "Natural",
        size: "100 mg",
        price: 50,
        qty: 1,
        image: "https://placehold.co/80x80/e8e8e8/888?text=Powder",
    },
];

const CheckOut=()=> {
    const [products, setProducts] = useState(initialProducts);
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);

    const removeItem = (id) =>
        setProducts((prev) => prev.filter((p) => p.id !== id));

    const changeQty = (id, delta) =>
        setProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
            )
        );

    const subtotal = products.reduce((sum, p) => sum + p.price * p.qty, 0);
    const discount = couponApplied ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    const applyCoupon = () => {
        if (coupon.trim()) setCouponApplied(true);
    };

    return (
        <div className="cart-page">
            <div className="container" style={{ maxWidth: 1100 }}>
                <a href="#" className="back-link">&#8249; Back</a>
                <h1 className="cart-title mb-4">Your Cart</h1>

                <div className="row g-4">
                    {/* LEFT: Products */}
                    <div className="col-lg-8">
                        {products.length === 0 ? (
                            <div className="empty-cart">
                                <div className="empty-cart-icon">🛒</div>
                                <p>Your cart is empty.</p>
                                <a href="#" style={{ color: "#111", fontSize: 13 }}>Continue shopping ›</a>
                            </div>
                        ) : (
                            <>
                                {products.map((p) => (
                                    <div className="cart-item-row" key={p.id}>
                                        <button className="remove-btn" onClick={() => removeItem(p.id)} title="Remove">&#215;</button>
                                        <img src={p.image} alt={p.title} className="item-image" />
                                        <div>
                                            <p className="item-title">{p.title}</p>
                                            <p className="item-meta">{p.category} / {p.size}</p>
                                        </div>
                                        <div className="qty-control">
                                            <button className="qty-btn" onClick={() => changeQty(p.id, -1)}>−</button>
                                            <span className="qty-val">{p.qty}</span>
                                            <button className="qty-btn" onClick={() => changeQty(p.id, 1)}>+</button>
                                        </div>
                                        <div className="item-price">${(p.price * p.qty).toFixed(2)}</div>
                                    </div>
                                ))}

                                <div className="coupon-box mt-4">
                                    <p className="coupon-label">Have a coupon? Enter your code.</p>
                                    <div className="coupon-row">
                                        <input
                                            type="text"
                                            className="coupon-input"
                                            placeholder="Coupon code"
                                            value={coupon}
                                            onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }}
                                        />
                                        <button className="coupon-apply-btn" onClick={applyCoupon}>APPLY</button>
                                    </div>
                                    {couponApplied && <p className="coupon-success">✓ Coupon applied — 10% discount</p>}
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT: Cart Totals */}
                    <div className="col-lg-4">
                        <div className="totals-card">
                            <div className="totals-title">Cart Totals</div>
                            <div className="totals-row">
                                <span>Shipping</span>
                                <span className="totals-free">Free</span>
                            </div>
                            <div className="totals-row">
                                <span>Tax (US estimated)</span>
                                <span>$0.00</span>
                            </div>
                            <div className="totals-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {couponApplied && (
                                <div className="discount-row">
                                    <span>Discount (10%)</span>
                                    <span>−${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <hr className="totals-divider" />
                            <div className="totals-total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button className="checkout-btn">Proceed to Checkout</button>
                            <button className="continue-btn">&#8249; Continue Shopping</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CheckOut;