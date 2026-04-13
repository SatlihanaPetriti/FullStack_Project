import { createContext, useContext, useState, useEffect } from "react";
import {
    get_favorites_service,
    add_favorite_service,
    remove_favorite_service,
} from "../Services/Favorite";

import { useUserContext } from "./Auth";
import Login from "../components/Login/login";

const FavoritesContext = createContext();

const FavoritesProvider = (props) => {
    const { user } = useUserContext();

    const [favorites, setFavorites] = useState([]);
    const [showLogin, setShowLogin] = useState(false);

    // GET favorites
    useEffect(() => {
        loadFavorites();
    }, [user]);

    const loadFavorites = async () => {
        if (!user) {
            setFavorites([]);
            return;
        }try {
            const result = await get_favorites_service();
            setFavorites(result.data);
        } catch (err) {
            console.error("GET favorites error:", err);
        }
    };

    // CHECK USER
    const checkUser = () => {
        if (!user) {
            setShowLogin(true);
            return false;
        }
        return true;
    };

    // ADD 
    const addFavorite = async (productId) => {
        if (!checkUser()) return;

        try {
            await add_favorite_service(productId);
            const result = await get_favorites_service();
            setFavorites(result.data);
        } catch (err) {
            console.error("ADD favorite error:", err);
        }
    };

    // REMOVE
    const removeFavorite = async (productId) => {
        if (!checkUser()) return;
        try {
            await remove_favorite_service(productId);
            setFavorites((prev) =>
                prev.filter((f) => f.product_id !== productId)
            );
        } catch (err) {
            console.error("REMOVE favorite error:", err);
        }
    };



    const values = { favorites, addFavorite, removeFavorite }

    return (
        <FavoritesContext.Provider value={values}
        >
            {props.children}
            <Login
                show={showLogin}
                handleClose={() => setShowLogin(false)}
            />
        </FavoritesContext.Provider>
    );
};
const useFavorites = () => {
    return useContext(FavoritesContext);
}

export { FavoritesProvider, useFavorites }