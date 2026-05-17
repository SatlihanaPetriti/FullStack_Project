import { useEffect, useState } from "react";
import { useOrderContext } from "../../../Context/OrderContext";
import "./OrdersAdmin.css";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "completed"];

const STATUS_COLORS = {
    pending: { bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
    processing: { bg: "#EFF6FF", color: "#1D4ED8", border: "#93C5FD" },
    shipped: { bg: "#F0FDF4", color: "#15803D", border: "#86EFAC" },
    delivered: { bg: "#F5F3FF", color: "#6D28D9", border: "#C4B5FD" },
    completed: { bg: "#ECFDF5", color: "#065F46", border: "#6EE7B7" },
};

const AdminOrders = () => {
    const { adminOrders, getAllOrders, updateOrderStatus } = useOrderContext();
    const [updating, setUpdating] = useState(null);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => { getAllOrders(); }, []);

    const handleStatusChange = async (orderId, status) => {
        setUpdating(orderId);
        await updateOrderStatus(orderId, status);
        setUpdating(null);
    };

    const counts = STATUS_OPTIONS.reduce((acc, s) => {
        acc[s] = adminOrders.filter((o) => o.status === s).length;
        return acc;
    }, {});

    return (
        <div className="ao-page">
            <div className="ao-header">
                <h1 className="ao-title">Orders</h1>
                <span className="ao-count">{adminOrders.length} total</span>
            </div>

            <div className="ao-stats">
                {STATUS_OPTIONS.map((s) => (
                    <div key={s} className="ao-stat-card" style={{
                        borderTop: `4px solid ${STATUS_COLORS[s].border}`,
                        background: STATUS_COLORS[s].bg,
                    }}>
                        <span className="ao-stat-count" style={{ color: STATUS_COLORS[s].color }}>{counts[s]}</span>
                        <span className="ao-stat-label">{s}</span>
                    </div>
                ))}
            </div>

            <div className="ao-table-wrapper">
                <table className="ao-table">
                    <thead>
                        <tr>
                            <th className="order-tb">ID</th>
                            <th className="order-tb">User</th>
                            <th className="order-tb">Date</th>
                            <th className="order-tb">Total</th>
                            <th className="order-tb">Status</th>
                            <th className="order-tb">Items</th>
                            <th className="order-tb">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminOrders.map((order) => (
                            <>
                                <tr key={order.id} className={expanded === order.id ? "ao-row ao-row--expanded" : "ao-row"}>
                                    <td className="ao-id">#{order.id}</td>
                                    <td className="ao-user">{`${order.user?.name} #${order.user_id}`}</td>
                                    <td className="ao-date">
                                        {new Date(order.created_at).toLocaleDateString({
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td className="ao-price">${Number(order.total_price).toFixed(2)}</td>
                                    <td>
                                        <span className="ao-badge" style={{
                                            background: STATUS_COLORS[order.status]?.bg,
                                            color: STATUS_COLORS[order.status]?.color,
                                            borderColor: STATUS_COLORS[order.status]?.border,
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="ao-items-count">{order.items?.length ?? 0} items</td>
                                    <td className="ao-actions">
                                        <select
                                            className="ao-select"
                                            value={order.status}
                                            disabled={updating === order.id}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <button className="ao-expand-btn" onClick={() => setExpanded((p) => p === order.id ? null : order.id)}>
                                            {expanded === order.id ? "▲" : "▼"}
                                        </button>
                                    </td>
                                </tr>

                                {expanded === order.id && (
                                    <tr key={`${order.id}-items`} className="ao-items-row">
                                        <td colSpan={7}>
                                            <div className="ao-items-wrapper">
                                                <table className="ao-items-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>Qty</th>
                                                            <th>Price</th>
                                                            <th>Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items?.map((item) => (
                                                            <tr key={item.id}>
                                                                <td>{item.product_title}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>${Number(item.price).toFixed(2)}</td>
                                                                <td>${(item.quantity * item.price).toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>

                {adminOrders.length === 0 && (
                    <div className="ao-empty">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;