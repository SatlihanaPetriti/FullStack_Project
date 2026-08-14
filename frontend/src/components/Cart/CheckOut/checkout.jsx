import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCartContext } from "../../../Context/CartContext";
import { useProductContext } from "../../../Context/Product";
import { useCategoryContext } from "../../../Context/Category";
import { useOrderContext } from "../../../Context/OrderContext";

import CheckoutModal from "./CheckoutModal";
import "./checkout.css";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/products/uploads/variants`;

const CheckOut = () => {
    const navigate = useNavigate();

    const { cart, updateQuantity, removeFromCart, clearCart } = useCartContext();
    const { products } = useProductContext();
    const { categories } = useCategoryContext();
    const { getOrders } = useOrderContext();

    const [modalOpen, setModalOpen] = useState(false);
    const [ordered, setOrdered] = useState(false);

    const items = cart?.items ?? [];
    const subtotal = Number(cart?.total_price ?? 0);
    const total = subtotal;
    const count = cart?.total_quantity ?? 0;

    const getProduct = (item) => products.find((p) => p.id === item.product_id) ?? item.product;

    const getImage = (product) => {
        const image = product?.variants?.find((v) => v.image)?.image;
        return image ? `${BASE_URL}/${image}` : null;
    };

    const getCategory = (product) =>
        categories.find((c) => c.id === product?.category_id)?.name ?? "";

    const cartItems = items.map((item) => {
        const product = getProduct(item);
        return {
            ...item,
            product,
            image: getImage(product),
            category: getCategory(product),
            size: product?.size ?? null,
            totalPrice: Number(item.price) * item.quantity,
        };
    });

    const goHome = () => navigate("/");
    const goBack = () => navigate(-1);

    const increaseQuantity = (item) => updateQuantity(item.id, item.quantity + 1);
    const decreaseQuantity = (item) => {
        if (item.quantity === 1) { removeFromCart(item.id); return; }
        updateQuantity(item.id, item.quantity - 1);
    };

    const handleOrderSuccess = async () => {
        await getOrders();
        await clearCart();
        setModalOpen(false);
        setOrdered(true);
    };

    if (ordered) {
        return (
            <div className="co-page">
                <div className="co-confirmed">
                    <div className="co-confirmed__icon">✓</div>
                    <h2 className="co-confirmed__title">Order Confirmed!</h2>
                    <p className="co-confirmed__sub">Thank you for your purchase. Your plants are on their way.</p>
                    <button className="co-btn-primary" onClick={goHome}>Continue Shopping</button>
                </div>
            </div>
        );
    }

    return (
        <div className="co-page">
            <div className="co-container">
                <button className="co-back" onClick={goBack}>&#8249; Back</button>
                <h1 className="co-title">Your Cart</h1>

                <div className="co-layout">

                    <div className="co-left">
                        {cartItems.length === 0 ? (
                            <div className="co-empty">
                                <p>Your cart is empty.</p>
                                <button className="co-link" onClick={goHome}>Continue shopping ›</button>
                            </div>
                        ) : (
                            <>
                                <div className="co-items">
                                    {cartItems.map((item) => (
                                        <div className="co-item" key={item.id}>
                                            <div className="co-item__img-wrap">
                                                {item.image
                                                    ? <img src={item.image} alt={item.product?.title} className="co-item__img" />
                                                    : <div className="co-item__img co-item__img--placeholder" />
                                                }
                                            </div>

                                            <div className="co-item__body ms-4">
                                                <p className="co-item__name">{item.product?.title}</p>
                                                <p className="co-item__meta">{item.category}</p>
                                                {item.size && <p className="co-item__size">{item.size}</p>}
                                            </div>

                                            <div className="co-qty ms-5">
                                                <button className="co-qty__btn" onClick={() => decreaseQuantity(item)}>−</button>
                                                <span className="co-qty__val">{item.quantity}</span>
                                                <button className="co-qty__btn" onClick={() => increaseQuantity(item)}>+</button>
                                            </div>

                                            <p className="co-item__price ms-5">${item.totalPrice.toFixed(2)}</p>

                                            <button className="co-item__remove" title="Remove" onClick={() => removeFromCart(item.id)}>
                                                &#215;
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="co-clear">
                                    <button className="co-clear__btn" onClick={clearCart}>Clear your shopping cart</button>
                                </div>
                            </>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="co-right">
                            <div className="co-totals">
                                <h3 className="co-totals__title">Order Summary</h3>
                                <div className="co-totals__row">
                                    <span>Items ({count})</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="co-totals__row">
                                    <span>Shipping</span>
                                    <span className="co-totals__free">Free</span>
                                </div>
                                <div className="co-totals__row">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="co-totals__divider" />
                                <div className="co-totals__total">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <button className="co-btn-primary" onClick={() => setModalOpen(true)}>Place Order</button>
                                <button className="co-btn-secondary" onClick={goHome}>&#8249; Continue Shopping</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <CheckoutModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleOrderSuccess} />
        </div>
    );
};

export default CheckOut;