import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    login_service,
    register_service,
    logout_service,
} from "../Services/Auth";

const AuthContext = createContext({});

const AuthProvider = (props) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const register = async (data) => {
        try {
            const result = await register_service(data);
            if (result.status === 200 || result.status === 201) {
                setUser(result.data);
                setError(null);
                if (result.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            setError("Registration failed. Please try again.");
        }
    };

    const login = async (data) => {
        try {
            const result = await login_service(data);
            if (result.status === 201) {
                setUser(result.data);
                setError(null);
                if (result.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            setError("Invalid email or password.");
        }
    };

    const logout = async () => {
        try {
            await logout_service();
            setUser(null);
            setError(null);
            navigate('/');
        } catch (error) {
            setError("Logout failed.");
        }
    };

    const values = {
        user,
        error,
        setError,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={values}>
            {props.children}
        </AuthContext.Provider>
    );
};

const useAuthContext = () => { return useContext(AuthContext); };

export { AuthProvider, useAuthContext };