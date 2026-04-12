import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart((prev) => {
            const exists = prev.find(p => p.product_id === item.product_id);

            if (exists) {
                return prev.map(p =>
                    p.product_id === item.product_id
                        ? { ...p, quantity: p.quantity + item.quantity }
                        : p
                );
            }

            return [...prev, item];
        });
    };
    const cartCount = cart.length;

    const removeFromCart = (product_id) => {
        setCart(prev => prev.filter(p => p.product_id !== product_id));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);