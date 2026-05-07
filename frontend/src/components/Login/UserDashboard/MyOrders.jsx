import { useState } from "react";
import { useOrderContext } from "../../../Context/OrderService.jsx";
import { useProductContext } from "../../../Context/Product";
import { useCategoryContext } from "../../../Context/Category";
import "./MyOrders.css";

const UserOrders = () => {
    const { orders } = useOrderContext();
    const { products } = useProductContext();
    const { categories } = useCategoryContext();

    const [openOrderId, setOpenOrderId] = useState(null);

    if (!orders?.length) {
        return <p className="empty-state">You have no orders yet</p>;
    }

    const getProduct = (item) =>
        products.find(p => p.id === item.product_id) ?? item.product;

    const getCategory = (product) =>
        categories.find(c => c.id === product?.category_id)?.name ?? "";

    const getImage = (product) =>
        product?.variants?.find(v => v.image)?.image;

    return (
        <div className="orders-container">
            <h2 className="orders-title">My Orders</h2>

            <div className="orders-list">
                {orders.map(order => {
                    const isOpen = openOrderId === order.id;

                    return (
                        <div key={order.id} className="order-card">

                            {/* HEADER */}
                            <div
                                className="order-header"
                                onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                            >
                                <p>
                                    Order #{order.id} —{" "}
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                                <span className="order-count">{order.items?.length ?? 0} items</span>
                            </div>

                            {/* ITEMS */}
                            {isOpen && (
                                <div className="order-items">

                                    {order.items?.map(item => {
                                        const product = getProduct(item);
                                        const categoryName = getCategory(product);
                                        const image = getImage(product);

                                        return (
                                            <div key={item.id} className="order-item">

                                                <div className="oi-left">

                                                    {image ? (
                                                        <img
                                                            src={`http://localhost:3000/products/uploads/variants/${image}`}
                                                            className="oi-img"
                                                        />
                                                    ) : (
                                                        <div className="oi-img-placeholder" />
                                                    )}

                                                    <div>
                                                        <p className="oi-cat">
                                                            {categoryName}
                                                        </p>

                                                        <p className="oi-name">
                                                            {product?.title}
                                                        </p>

                                                        <span className="oi-qty">
                                                            x{item.quantity}
                                                        </span>
                                                    </div>

                                                </div>

                                                <p className="oi-price">
                                                    $ {Number(item.price).toFixed(2)}
                                                </p>

                                            </div>
                                        );
                                    })}

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