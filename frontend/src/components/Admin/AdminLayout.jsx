import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';
import { UserRoundCog, LayoutDashboard, Package, Layers, ShoppingCart, Warehouse, LogOut} from 'lucide-react';
import { useUserContext } from '../../Context/Auth';

const AdminLayout = ({ children }) => {
    const { user, logout } = useUserContext();

    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar">

                {/* Logo */}
                <div className="admin-logo">
                    <UserRoundCog size={30} />
                    <span className="admin-logo-text">
                        PlantShop<br />
                        <small>Admin Dashboard</small>
                    </span>
                </div>

                {/* Links */}
                <Nav className="flex-column admin-nav">
                    <NavLink to="/admin/overview" className="admin-nav-link">
                        <LayoutDashboard size={16} /> Overview
                    </NavLink>
                    <NavLink to="/admin/products" className="admin-nav-link">
                        <Package size={16} /> All Products
                    </NavLink>
                    <NavLink to="/admin/categories" className="admin-nav-link">
                        <Layers size={16} /> Categories
                    </NavLink>
                    <NavLink to="/admin/orders" className="admin-nav-link">
                        <ShoppingCart size={16} /> Orders
                    </NavLink>
                    <NavLink to="/admin/inventory" className="admin-nav-link">
                        <Warehouse size={16} /> Inventory
                    </NavLink>
                </Nav>

                {/* Footer i sidebar — user info + logout */}
                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-user-details">
                            <span className="admin-user-name">
                                {user?.name} {user?.lastname}
                            </span>
                            <span className="admin-user-role">Administrator</span>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={logout} title="Log Out">
                        <LogOut size={18} />
                    </button>
                </div>

            </aside>

            <main className="admin-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;