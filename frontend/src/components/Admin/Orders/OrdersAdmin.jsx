import { useEffect, useState } from "react";
import { get_my_orders_service, update_order_status_service } from "../../../Services/OrderService";
import "./OrdersAdmin.css";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered"];

const STATUS_COLORS = {
    pending: { bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
    processing: { bg: "#EFF6FF", color: "#1D4ED8", border: "#93C5FD" },
    shipped: { bg: "#F0FDF4", color: "#15803D", border: "#86EFAC" },
    delivered: { bg: "#F5F3FF", color: "#6D28D9", border: "#C4B5FD" },
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [updating, setUpdating] = useState(null);
    const [expanded, setExpanded] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await get_my_orders_service();
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        setUpdating(orderId);
        try {
            await update_order_status_service(orderId, status);
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status } : o))
            );
        } catch (err) {
            console.error("Failed to update status:", err);
        } finally {
            setUpdating(null);
        }
    };

    const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

    return (
        <div className="ao-page">
            <div className="ao-header">
                <h1 className="ao-title">Orders</h1>
                <span className="ao-count">{orders.length} total</span>
            </div>

            <div className="ao-table-wrapper">
                <table className="ao-table">
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Items</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <>
                                <tr key={order.id} className={expanded === order.id ? "ao-row ao-row--expanded" : "ao-row"}>
                                    <td className="ao-id">#{order.id}</td>
                                    <td className="ao-date">
                                        {new Date(order.created_at).toLocaleDateString("sq-AL", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </td>
                                    <td className="ao-price">${Number(order.total_price).toFixed(2)}</td>
                                    <td>
                                        <span
                                            className="ao-badge"
                                            style={{
                                                background: STATUS_COLORS[order.status]?.bg,
                                                color: STATUS_COLORS[order.status]?.color,
                                                borderColor: STATUS_COLORS[order.status]?.border,
                                            }}
                                        >
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
                                        <button
                                            className="ao-expand-btn"
                                            onClick={() => toggleExpand(order.id)}
                                        >
                                            {expanded === order.id ? "▲" : "▼"}
                                        </button>
                                    </td>
                                </tr>

                                {expanded === order.id && (
                                    <tr key={`${order.id}-items`} className="ao-items-row">
                                        <td colSpan={6}>
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

                {orders.length === 0 && (
                    <div className="ao-empty">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;