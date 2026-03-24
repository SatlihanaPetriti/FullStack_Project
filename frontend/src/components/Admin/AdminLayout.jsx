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
                    <NavLink to="/admin/overview" className="admin-nav-link">
                        Overview
                    </NavLink>

                    <NavLink to="/admin/products" className="admin-nav-link">
                        All Products
                    </NavLink>
                    <NavLink to="/admin/categories" className="admin-nav-link">
                        Categories
                    </NavLink>
                    <NavLink to="/admin/orders" className="admin-nav-link">
                        Orders
                    </NavLink>
                    <NavLink to="/admin/inventory" className="admin-nav-link">
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
