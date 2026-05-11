import UserOrders from "./MyOrders.jsx";
import DashboardFavorites from "./Favorite";
import { useOrderContext } from "../../../Context/OrderService.jsx";
import { useFavorites } from "../../../Context/Favorite";
import "./dashboard.css";

const AccountDashboard = () => {
    const { orders } = useOrderContext();
    const { favorites } = useFavorites();

    const totalSpent = orders?.reduce((sum, order) => {
        const orderTotal = order.items?.reduce((s, item) => s + Number(item.price) * item.quantity, 0) ?? 0;
        return sum + orderTotal;
    }, 0) ?? 0;

    return (
        <div className="account-dashboard">

            <h2 className="dashboard-page-title">Dashboard</h2>

            {/* Stats row */}
            <div className="dash-stats-row">
                <div className="dash-stat">
                    <span className="dash-stat-num">{orders?.length ?? 0}</span>
                    <span className="dash-stat-label">Orders</span>
                </div>
                <div className="dash-stat">
                    <span className="dash-stat-num">{favorites?.length ?? 0}</span>
                    <span className="dash-stat-label">Favorites</span>
                </div>
                <div className="dash-stat">
                    <span className="dash-stat-num">€{totalSpent.toFixed(2)}</span>
                    <span className="dash-stat-label">Total Spent</span>
                </div>
            </div>

            {/* Orders section */}
            <section className="dash-section">
                <div className="dash-section-header">
                    <div className="dash-section-left">
                        <div className="dash-section-titles">
                            <h3 className="dash-section-title">My Orders</h3>
                            <span className="dash-section-sub">Track your purchase history</span>
                        </div>
                    </div>
                    <span className="dash-section-pill dash-section-pill--orders">
                        {orders?.length ?? 0} order{orders?.length !== 1 ? "s" : ""}
                    </span>
                </div>
                <UserOrders />
            </section>

            {/* Favorites section */}
            <section className="dash-section">
                <div className="dash-section-header">
                    <div className="dash-section-left">
                        <div className="dash-section-titles">
                            <h3 className="dash-section-title">My Favorites</h3>
                            <span className="dash-section-sub">Products you've saved</span>
                        </div>
                    </div>
                    <span className="dash-section-pill dash-section-pill--favorites">
                        {favorites?.length ?? 0} saved
                    </span>
                </div>
                <DashboardFavorites />
            </section>

        </div>
    );
};

export default AccountDashboard;