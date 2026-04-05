import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import OverviewPage from '../../components/Admin/Overview/OverviewPage';
import AdminProductsPage from '../../components/Admin/AdminProductsPage';
import CategoriesPage from '../../components/Admin/AdminCategories';

const AdminRouter = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<OverviewPage />} />
                <Route path="categories" element={<CategoriesPage />} /> 
                <Route path="products" element={<AdminProductsPage />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminRouter;