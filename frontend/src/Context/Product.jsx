import { createContext, useContext, useState, useEffect } from "react";
import {
    get_products_service,
    create_product_service,
    update_product_service,
    delete_product_service,
    get_product_by_id_service
} from "../Services/Product";

const ProductContext = createContext({});

const ProductProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load all products
    const getAllProducts = async () => {
        setLoading(true);
        try {
            const result = await get_products_service();
            if (result.status === 200) {
                setProducts(result.data);
                setError(null);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to load products");
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get single product by ID
    const getProductById = async (id) => {
        setLoading(true);
        try {
            const result = await get_product_by_id_service(id);
            setError(null);
            return result.data;
        } catch (error) {
            setError(error.response?.data?.message || "Failed to load product");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Create new product
    const createProduct = async (productData) => {
        setLoading(true);
        try {
            const result = await create_product_service(productData);
            if (result.status === 201 || result.status === 200) {
                // Refresh the product list
                await getAllProducts();
                setError(null);
            }
            return result;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create product";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Update product
    const updateProduct = async (id, productData) => {
        setLoading(true);
        try {
            const result = await update_product_service(id, productData);
            if (result.status === 200) {
                setProducts(prev =>
                    prev.map(p => p.id === id ? { ...p, ...productData } : p)
                );
                setError(null);
            }
            return result;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update product";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Delete product
    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            const result = await delete_product_service(id);
            if (result.status === 200) {
                // Refresh the product list
                await getAllProducts();
                setError(null);
            }
            return result;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete product";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Load products on mount
    useEffect(() => {
        getAllProducts();
    }, []);

    const values = {
        products,
        loading,
        error,
        getAllProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct
    };

    return (
        <ProductContext.Provider value={values}>
            {props.children}
        </ProductContext.Provider>
    );
};

const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
};

export { ProductProvider, useProductContext };