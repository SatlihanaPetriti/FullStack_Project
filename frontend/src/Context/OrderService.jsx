import { createContext, useContext, useState, useEffect } from "react";
import { get_my_orders_service, update_order_status_service } from "../Services/OrderService";

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
    
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const res = await get_my_orders_service();
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to get orders:", err);
        } 
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await update_order_status_service(orderId, status);
            await getOrders();
        } catch (err) {
            console.error("Failed to update order status:", err);
        }
    };


    return (
        <OrderContext.Provider value={{ orders, getOrders, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};

const useOrderContext = () => useContext(OrderContext);

export { OrderProvider, useOrderContext };