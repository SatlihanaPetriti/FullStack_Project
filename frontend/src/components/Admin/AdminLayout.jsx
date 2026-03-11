import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';
import { UserRoundCog } from 'lucide-react';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <UserRoundCog size={30} />
                    <span className="admin-logo-text">PlantShop<br /><small>Admin Dashboard</small></span>
                </div>

                <Nav className="flex-column admin-nav">
                    <NavLink to="/admin/overview" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>
                         Overview
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>
                         Products
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>
                         Orders
                    </NavLink>
                    <NavLink to="/admin/inventory" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>
                        Inventory
                    </NavLink>
                </Nav>
            </aside>
            <main className="admin-content">
                {children}
            </main>

        </div>
    );
};

export default AdminLayout;
