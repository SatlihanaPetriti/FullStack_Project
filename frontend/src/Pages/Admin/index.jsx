import { Routes, Route } from "react-router-dom";
import AdminProductsPage from '../../components/Admin/AdminProductsPage';
import ViewProducts from '../../components/Admin/ViewProducts';
import AdminNavbar from "../../components/Admin/navadmin";

const AdminPageController = () => {
    return (
         <>
         <AdminNavbar />
        <Routes>
            <Route path="/" element={<ViewProducts />} />
            <Route path="/products" element={<AdminProductsPage />} />
        </Routes>
        </>
    );
};

export default AdminPageController;