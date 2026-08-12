import { NavLink, Outlet } from 'react-router-dom';
import { User, LayoutDashboard, LogOut } from 'lucide-react';
import { useUserContext } from '../../../Context/Auth';
import './userLayout.css';

const UserLayout = () => {
    const { user, logout } = useUserContext();

    return (
        <div className="user-layout-wrapper">
            <aside className="user-sidebar">

                {/* Avatar + name block */}
                <div className="user-logo">
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="user-sidebar-info">
                        <p className="user-welcome">
                            Welcome, {user?.name}
                        </p>

                        <p className="user-fullname">
                            {user?.name} {user?.lastname}
                        </p>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="user-nav">
                    <NavLink to="/account" end className="user-nav-link">
                        <LayoutDashboard size={15} /> Dashboard
                    </NavLink>
                    <NavLink to="/account/profile" className="user-nav-link">
                        <User size={15} /> My Profile
                    </NavLink>
                </nav>

                <div className="user-sidebar-divider" />

                {/* Logout */}
                <div className="user-sidebar-footer">
                    <button onClick={logout} className="user-logout">
                        <LogOut size={15} /> Logout
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
