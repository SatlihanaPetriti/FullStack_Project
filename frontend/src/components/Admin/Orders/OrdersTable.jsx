import { Fragment } from "react";
import { STATUS_OPTIONS, STATUS_COLORS } from "./OrdersAdmin";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const OrdersTable = ({
    orders,
    expandedOrder,
    updatingOrder,
    onToggleExpanded,
    onStatusChange,
}) => {
    if (orders.length === 0) {
        return (
            <div className="ao-table-wrapper">
                <div className="ao-empty">No orders found.</div>
            </div>
        );
    }

    return (
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
                    {orders.map((order) => {
                        const expanded = expandedOrder === order.id;
                        const statusStyle = STATUS_COLORS[order.status];

                        return (
                            <Fragment key={order.id}>
                                <tr className={expanded ? "ao-row ao-row--expanded" : "ao-row"}>
                                    <td className="ao-id">#{order.id}</td>
                                    <td className="ao-user">{order.user?.name} #{order.user_id}</td>
                                    <td className="ao-date">{formatDate(order.created_at)}</td>
                                    <td className="ao-price">${Number(order.total_price).toFixed(2)}</td>
                                    <td>
                                        <span
                                            className="ao-badge"
                                            style={{
                                                background: statusStyle?.bg,
                                                color: statusStyle?.color,
                                                borderColor: statusStyle?.border,
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
                                            disabled={updatingOrder === order.id}
                                            onChange={(e) => onStatusChange(order.id, e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            className="ao-expand-btn"
                                            onClick={() => onToggleExpanded(order.id)}
                                        >
                                            {expanded ? "▲" : "▼"}
                                        </button>
                                    </td>
                                </tr>

                                {expanded && (
                                    <tr className="ao-items-row">
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
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;