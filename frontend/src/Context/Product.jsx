import { createContext, useContext, useState, useEffect } from "react";
import {
    get_products_service,
    create_product_service,
    update_product_service,
    delete_product_service,
    get_product_by_id_service,
    add_to_stock_service
} from "../Services/Product.jsx";

//   krijohet nje context global per produktet( ku do te shperndaje produktet, loading, error, dhe funksionet crud)
const ProductContext = createContext({});
// komponenti qe do te mbeshtjelle te gjihthw aplikacionin (index.jsx)
// roli i props  perdoret per te marre children (props.children) qe ti jape akses ne ProductContext 
const ProductProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAllProducts = async () => {
        setLoading(true);
        try {
            const result = await get_products_service();
            if (result.status === 200) {
                setProducts(result.data);
            }
        } catch (error) {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const getProductById = async (id) => {
        setLoading(true);
        try {
            const result = await get_product_by_id_service(id);
            return result.data;
        } catch (error) {
            setError("Failed to get product");
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (productData, images = []) => {
        setLoading(true);
        try {
            const result = await create_product_service(productData, images);
            await getAllProducts();
            return result;
        } catch (error) {
            setError("Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id, productData, images = []) => {
        setLoading(true);
        try {
            const result = await update_product_service(id, productData, images);
            await getAllProducts();
            return result;
        } catch (error) {
            setError("Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    const onAddStock = async ({ id, stock }) => {
        try {
            const result = await add_to_stock_service(id, stock);
            await getAllProducts();
            return result;
        } catch (error) {
            setError("Failed to add stock");
        }
    };

    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            const result = await delete_product_service(id);
            await getAllProducts();
            return result;
        } catch (error) {
            setError("Failed to delete product");
        } finally {
            setLoading(false);
        }
    };

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
        deleteProduct,
        onAddStock
    };

    return (
        <ProductContext.Provider value={values}>
            {props.children}
        </ProductContext.Provider>
    );
};

const useProductContext = () => { return useContext(ProductContext); };

export { ProductProvider, useProductContext };
