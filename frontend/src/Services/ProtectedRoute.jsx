import { Navigate } from "react-router-dom";
import { useUserContext } from "../Context/Auth";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthChecked, user } = useUserContext();

    if (!isAuthChecked) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;