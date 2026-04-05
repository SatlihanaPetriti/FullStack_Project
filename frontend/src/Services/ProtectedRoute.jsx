import { Navigate } from "react-router-dom";
import { useUserContext } from "../Context/Auth";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthChecked, user } = useUserContext();

    console.log("ProtectedRoute - isAuthChecked:", isAuthChecked, "user:", user);

    if (!isAuthChecked) {
        return <div>Loading...</div>;
    }
    // ndalon userin  te shkoje ne admin /admin e rikthen ne home
    // kalohet tek admin route
    return children;
};

export default ProtectedRoute;