import { NavLink, useNavigate } from "react-router-dom";
import {
    UserRoundCog,
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    LogOut,
    ExternalLink,
    Mail,
} from "lucide-react";

import { useUserContext } from "../../Context/Auth";

import "./AdminLayout.css";

const adminLinks = [
    {
        path: "/admin/overview",
        label: "Overview",
        icon: LayoutDashboard,
    },
    {
        path: "/admin/products",
        label: "All Products",
        icon: Package,
    },
    {
        path: "/admin/categories",
        label: "Categories",
        icon: Layers,
    },
    {
        path: "/admin/orders",
        label: "Orders",
        icon: ShoppingCart,
    },
    {
        path: "/admin/subscribers",
        label: "Subscribers",
        icon: Mail,
    },
];

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const { user, logout } = useUserContext();

    const userInitial = user?.name?.charAt(0).toUpperCase() ?? "";

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar">

                <div className="admin-logo">
                    <UserRoundCog size={30} />

                    <span className="admin-logo-text">
                        ECOMUS
                        <br />
                        <small>Admin Dashboard</small>
                    </span>
                </div>

                <nav className="flex-column admin-nav">
                    {adminLinks.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className="admin-nav-link"
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}

                    <hr className="admin-nav-divider" />

                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-nav-link admin-visit-link"
                    >
                        <ExternalLink size={16} />
                        Visit Shop
                    </a>
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-avatar">
                            {userInitial}
                        </div>

                        <div className="admin-user-details">
                            <span className="admin-user-name">
                                {user?.name} {user?.lastname}
                            </span>

                            <span className="admin-user-role">
                                Administrator
                            </span>
                        </div>
                    </div>

                    <button
                        className="admin-logout-btn"
                        onClick={handleLogout}
                        title="Log Out"
                    >
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