import { useCart } from "../../Context/CartContext";
import "./index.css";

const CartDrawer = ({ show, onClose }) => {
    const { cart, removeFromCart } = useCart();

    if (!show) return null;

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>

                <div className="cart-header">
                    <h5>Your Bag</h5>
                    <button onClick={onClose}>X</button>
                </div>

                {cart.length === 0 ? (
                    <p>Cart is empty</p>
                ) : (
                    cart.map(item => (
                        <div key={item.product_id} className="cart-item">
                            <img
                                src={`http://localhost:3000/products/uploads/variants/${item.image}`}
                                width="50"
                            />

                            <div>
                                <p>{item.title}</p>
                                <p>Qty: {item.quantity}</p>
                                <p>€{item.price}</p>
                            </div>

                            <button onClick={() => removeFromCart(item.product_id)}>
                                X
                            </button>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default CartDrawer;