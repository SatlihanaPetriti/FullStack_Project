import UserOrders from "./MyOrders.jsx";
import DashboardFavorites from "./Favorite";

const AccountDashboard = () => {
    return (
        <div className="account-dashboard">

            <section>
                <h3>My Orders</h3>
                <UserOrders />
            </section>

            <section>
                <h3>My Favorites</h3>
                <DashboardFavorites />
            </section>

        </div>
    );
};

export default AccountDashboard;