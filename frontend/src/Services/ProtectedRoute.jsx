import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Context/Auth.jsx";
// protected route sherben per t embrojtur faqet qe kerkojne autentikim


// children do t ejete komponenti qe do te mbrohet (AdminRouter)
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuthContext();
    if (!user) {
        // ridrejton perdoruesin ne home nese nuk eshte i loguar
        // replace- zevendeson historikun (nuk mund të kthehesh mbrapa)
        return <Navigate to="/" replace />;
    }
    // ndalon userin  te shkoje ne admin /admin e rikthen ne home
    if (requiredRole === 'admin' && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // kalihet tek adminroute
    return children;
};

export default ProtectedRoute;