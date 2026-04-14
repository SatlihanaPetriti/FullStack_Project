import { createContext, useContext, useState, useEffect } from "react";
import {
    get_cart_service,
    add_to_cart_service,
    update_cart_quantity_service,
    remove_from_cart_service,
    clear_cart_service,
} from "../Services/CartService";

// Context global
const CartContext = createContext({});

// Provider
const CartProvider = (props) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCart();
    }, []);

    // GET CART
    const getCart = async () => {
        setLoading(true);
        try {
            const result = await get_cart_service();
            if (result.status === 200) {
                setCart(result.data);
            }
        } catch (error) {
            setError("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    // ADD TO CART
    const addToCart = async (productId, quantity) => {
        setLoading(true);
        try {
            const result = await add_to_cart_service(productId, quantity);
            await getCart();
            return result;
        } catch (error) {
            setError("Failed to add to cart");
        } finally {
            setLoading(false);
        }
    };

    // UPDATE QUANTITY
    const updateQuantity = async (cartItemId, quantity) => {
        setLoading(true);
        try {
            const result = await update_cart_quantity_service(cartItemId, quantity);
            await getCart();
            return result;
        } catch (error) {
            setError("Failed to update quantity");
        } finally {
            setLoading(false);
        }
    };

    // REMOVE ONE ITEM
    const removeFromCart = async (cartItemId) => {
        setLoading(true);
        try {
            const result = await remove_from_cart_service(cartItemId);
            await getCart();
            return result;
        } catch (error) {
            setError("Failed to remove item");
        } finally {
            setLoading(false);
        }
    };

    // CLEAR ENTIRE CART
    const clearCart = async () => {
        setLoading(true);
        try {
            const result = await clear_cart_service();
            await getCart();
            return result;
        } catch (error) {
            setError("Failed to clear cart");
        } finally {
            setLoading(false);
        }
    };

    const values = {
        cart,
        loading,
        error,
        getCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
    };

    return (
        <CartContext.Provider value={values}>
            {props.children}
        </CartContext.Provider>
    );
};

const useCartContext = () => {
    return useContext(CartContext);
};

export { CartProvider, useCartContext };