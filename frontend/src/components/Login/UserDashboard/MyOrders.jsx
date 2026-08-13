import { useState } from "react";
import { useOrderContext } from "../../../Context/OrderContext";
import { useProductContext } from "../../../Context/Product";
import { useCategoryContext } from "../../../Context/Category";
import "./MyOrders.css";

const BASE_URL = `${import.meta.env.REACT_APP_BACKEND_URL}/products/uploads/variants`;

const STATUS_COLOR = {
    pending: "#e07b39",
    processing: "#3a7bbf",
    shipped: "#6d28d9",
    delivered: "#2d6a4f",
    completed: "#3aa160",
};

const UserOrders = () => {
    const { orders } = useOrderContext();
    const { products } = useProductContext();
    const { categories } = useCategoryContext();
    const [openOrderId, setOpenOrderId] = useState(null);

    const getProduct = (item) => products.find((product) => product.id === item.product_id) ?? item.product;
    const getCategory = (product) => categories.find((category) => category.id === product?.category_id)?.name ?? "";
    const getImage = (product) => product?.variants?.find((variant) => variant.image)?.image;
    const toggleOrder = (orderId) => setOpenOrderId((prev) => prev === orderId ? null : orderId);

    if (!orders?.length) {
        return (
            <div className="ord-empty">
                <p className="ord-empty-title">No orders yet</p>
                <span className="ord-empty-sub">Your past orders will appear here</span>
            </div>
        );
    }

    return (
        <div className="ord-root">
            <div className="ord-list">
                {orders.map((order) => {
                    const isOpen = openOrderId === order.id;
                    const itemCount = order.items?.length ?? 0;
                    const orderTotal = order.items?.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) ?? 0;
                    const statusColor = STATUS_COLOR[order.status];

                    return (
                        <div key={order.id} className="ord-card">
                            <div className="ord-header" onClick={() => toggleOrder(order.id)}>
                                <div className="ord-meta">
                                    <span className="ord-id">Order #{order.id}</span>
                                    <span className="ord-date">
                                        {new Date(order.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                <div className="ord-right">
                                    {order.status && (
                                        <span className="ord-status" style={{ color: statusColor, borderColor: statusColor }}>
                                            {order.status}
                                        </span>
                                    )}
                                    <span className="ord-pill">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                                </div>

                                <span className={`ord-chevron${isOpen ? " open" : ""}`}>›</span>
                            </div>

                            {isOpen && (
                                <div className="ord-items">
                                    {order.items?.map((item) => {
                                        const product = getProduct(item);
                                        const categoryName = getCategory(product);
                                        const image = getImage(product);

                                        return (
                                            <div key={item.id} className="ord-item">
                                                <div className="oi-img">
                                                    {image ? (
                                                        <img src={`${BASE_URL}/${image}`} alt={product?.title} />
                                                    ) : (
                                                        <div className="oi-img-placeholder" />
                                                    )}
                                                </div>

                                                <div className="oi-info">
                                                    <span className="oi-cat">{categoryName}</span>
                                                    <span className="oi-name">{product?.title}</span>
                                                    <span className="oi-qty">×{item.quantity}</span>
                                                </div>

                                                <span className="oi-price">€{Number(item.price).toFixed(2)}</span>
                                            </div>
                                        );
                                    })}

                                    <div className="ord-total-line">
                                        <span>Total</span>
                                        <span>€{orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserOrders;