import { useEffect, useState } from "react";

import { useOrderContext } from "../../../Context/OrderContext";

import OrdersTable from "./OrdersTable";

import "./OrdersAdmin.css";

export const STATUS_OPTIONS = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "completed",
];

export const STATUS_COLORS = {
    pending: {
        bg: "#FFF7ED",
        color: "#C2410C",
        border: "#FDBA74",
    },
    processing: {
        bg: "#EFF6FF",
        color: "#1D4ED8",
        border: "#93C5FD",
    },
    shipped: {
        bg: "#F0FDF4",
        color: "#15803D",
        border: "#86EFAC",
    },
    delivered: {
        bg: "#F5F3FF",
        color: "#6D28D9",
        border: "#C4B5FD",
    },
    completed: {
        bg: "#ECFDF5",
        color: "#065F46",
        border: "#6EE7B7",
    },
};

const AdminOrders = () => {
    const {
        adminOrders,
        getAllOrders,
        updateOrderStatus,
    } = useOrderContext();

    const [updatingOrder, setUpdatingOrder] =
        useState(null);

    const [expandedOrder, setExpandedOrder] =
        useState(null);

    useEffect(() => {
        getAllOrders();
    }, []);

    const counts = STATUS_OPTIONS.reduce(
        (acc, status) => {
            acc[status] = adminOrders.filter(
                (order) => order.status === status
            ).length;

            return acc;
        },
        {}
    );

    const handleStatusChange = async (
        orderId,
        status
    ) => {
        setUpdatingOrder(orderId);

        await updateOrderStatus(
            orderId,
            status
        );

        setUpdatingOrder(null);
    };

    const toggleExpanded = (orderId) => {
        setExpandedOrder((prev) =>
            prev === orderId
                ? null
                : orderId
        );
    };

    return (
        <div className="ao-page">

            <div className="ao-header">
                <h1 className="ao-title">
                    Orders
                </h1>

                <span className="ao-count">
                    {adminOrders.length} total
                </span>
            </div>

            <div className="ao-stats">
                {STATUS_OPTIONS.map((status) => (
                    <div
                        key={status}
                        className="ao-stat-card"
                        style={{
                            borderTop: `4px solid ${STATUS_COLORS[status].border}`,
                            background:
                                STATUS_COLORS[status].bg,
                        }}
                    >
                        <span
                            className="ao-stat-count"
                            style={{
                                color:
                                    STATUS_COLORS[status].color,
                            }}
                        >
                            {counts[status]}
                        </span>

                        <span className="ao-stat-label">
                            {status}
                        </span>
                    </div>
                ))}
            </div>

            <OrdersTable
                orders={adminOrders}
                expandedOrder={expandedOrder}
                updatingOrder={updatingOrder}
                onToggleExpanded={toggleExpanded}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default AdminOrders;