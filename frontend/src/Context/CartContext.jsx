import { createContext, useContext, useState, useEffect } from "react";
import {
    get_cart_service,
    add_to_cart_service,
    update_cart_quantity_service,
    remove_from_cart_service,
    clear_cart_service,
} from "../Services/CartService";
import { useUserContext } from "./Auth";
import Login from "../components/Login/login";

const CartContext = createContext({});

const CartProvider = (props) => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const { user } = useUserContext();

    useEffect(() => {
        if (user) {
            getCart();
        } else {
            setCart(null);
        }
    }, [user]);

    const checkUser = () => {
        if (!user) {
            setShowLogin(true);
            return false;
        }
        return true;
    };

    // GET CART
    const getCart = async () => {
        try {
            const result = await get_cart_service();
            setCart(result.data);
            setError(null);
        } catch (error) {
            setError("Failed to load cart");
        }
    };

    // ADD TO CART
    const addToCart = async (productId, quantity) => {
        
        console.log("CartContext received:",{productId,quantity});
        
        if (!checkUser()) return;
        try {
            const result = await add_to_cart_service([
                {
                    product_id: productId,
                    quantity,
                },
            ]);

            await getCart();
            return result;
        } catch (error) {
            setError("Failed to add to cart");
        }
    };

    // UPDATE QUANTITY
    const updateQuantity = async (cartItemId, quantity) => {
        try {
            const result = await update_cart_quantity_service(cartItemId, quantity);

            setCart((prev) => {
                const updatedItems = prev.items.map((item) =>
                    item.id === result.data.id
                        ? { ...item, quantity: result.data.quantity }
                        : item
                );

                const total_quantity = updatedItems.reduce(
                    (sum, i) => sum + i.quantity,0
                );

                const total_price = updatedItems.reduce(
                    (sum, i) => sum + i.quantity * Number(i.price),0
                );

                return {
                    ...prev,
                    items: updatedItems,
                    total_quantity,
                    total_price,
                };
            });

            return result;
        } catch (error) {
            setError("Failed to update quantity");
        }
    };

    // REMOVE ITEM
    const removeFromCart = async (cartItemId) => {
        try {
            await remove_from_cart_service(cartItemId);
            await getCart();
        } catch (error) {
            setError("Failed to remove item");
        }
    };

    // CLEAR CART
    const clearCart = async () => {
        try {
            await clear_cart_service();
        } catch (error) {
            setError('Clear cart')
        }
        setCart(null);
    };

    return (
        <CartContext.Provider
            value={{
                user,
                cart,
                error,
                getCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {props.children}
            <Login
                show={showLogin}
                handleClose={() => setShowLogin(false)}
            />
        </CartContext.Provider>
    );
};

const useCartContext = () => useContext(CartContext);

export { CartProvider, useCartContext };