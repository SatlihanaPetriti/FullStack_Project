import { createContext, useContext, useState, useEffect } from "react";
import { get_my_orders_service } from "../services/OrderService";

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    const getOrder = async () => {
        try {
            const res = await get_my_orders_service();
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to get orders:", err);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

    const values = { orders, getOrder };

    return (
        <OrderContext.Provider value={values}>
            {children}
        </OrderContext.Provider>
    );
};
const useOrderContext = () => {
    return useContext(OrderContext);
};

export { OrderProvider, useOrderContext };