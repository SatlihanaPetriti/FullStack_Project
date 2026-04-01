import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register_user, login_user, logout_user, checkAuth_user_service } from "../Services/Auth";

const UserContext = createContext({});

const UserProvider = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const checkAuthUser = async () => {
        try {
            const result = await checkAuth_user_service();
            if (result.status === 200) setUser(result.data);
            else setUser(null);
        } catch {
            setUser(null);
        } finally {
            setIsAuthChecked(true);
        }
    };

    useEffect(() => { checkAuthUser(); }, [trigger]);

    const register = async (data) => {
        try {
            const result = await register_user(data);
            if (result.status === 201) {
                setUser(result.data);
                setError(null);
                result.data.role === "admin" ? navigate("/admin") : navigate("/");
            }
        } catch {
            setError("Registration failed. Please try again.");
        }
    };

    const login = async (data) => {
        try {
            const result = await login_user(data);
            if (result.status === 201) {
                setUser(result.data);
                setError(null);
                result.data.role === "admin" ? navigate("/admin") : navigate("/");
            }
        } catch (error) {
            throw error.response?.data;
        }
    };

    const logout = async () => {
        try {
            await logout_user();
            setUser(null);
            setTrigger(t => !t);
            navigate("/");
        } catch (error) {
            return error;
        }
    };

    const values = { register, login, logout, user, error, setError, isAuthChecked, checkAuthUser };

    return (
        <UserContext.Provider value={values}>
            {props.children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext, UserProvider };