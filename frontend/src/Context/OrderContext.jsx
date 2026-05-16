import { createContext, useContext, useState, useEffect } from "react";
import {
    get_my_orders_service,
    get_all_orders_service,
    update_order_status_service,
} from "../Services/OrderService";


const OrderContext = createContext();

const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [adminOrders, setAdminOrders] = useState([]);

    useEffect(() => {
        getOrders();
        getAllOrders();

    }, []);

    const getOrders = async () => {
        try {
            const res = await get_my_orders_service();
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to get orders:", err);
        }
    };

    const getAllOrders = async () => {
        try {
            const res = await get_all_orders_service();
            setAdminOrders(res.data);
        } catch (err) {
            console.error("Failed to get all orders:", err);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await update_order_status_service(orderId, status);
            await getAllOrders();
        } catch (err) {
            console.error("Failed to update order status:", err);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, getOrders, adminOrders, getAllOrders, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};

const useOrderContext = () => useContext(OrderContext);

export { OrderProvider, useOrderContext };