import { NavLink, Outlet } from 'react-router-dom';
import { User, LayoutDashboard, LogOut } from 'lucide-react';
import { useUserContext } from '../../../Context/Auth';
import './UserLayout.css';

const UserLayout = () => {
    const { user, logout } = useUserContext();

    return (
        <div className="user-wrapper">
            <aside className="user-sidebar">

                <div className="user-logo">
                    <User size={28} />
                    <span>
                        My Account<br />
                        <small>Dashboard</small>
                    </span>
                </div>

                <nav className="user-nav">
                    <NavLink to="/account" className="user-nav-link">
                        <LayoutDashboard size={16} /> Dashboard
                    </NavLink>
                    <NavLink to="/account/profile" className="user-nav-link">
                        <User size={16} /> My Profile
                    </NavLink>
                    
                </nav>

                <div className="user-sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <div className="user-name">
                                {user?.name} {user?.lastname}
                            </div>
                        </div>
                    </div>

                    <button onClick={logout} className="user-logout">
                        <LogOut size={18} /> Logout
                    </button>
                </div>

            </aside>

            <main className="user-content">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;