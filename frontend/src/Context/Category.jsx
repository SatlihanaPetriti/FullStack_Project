import { createContext, useContext, useState, useEffect } from "react";
import {
    get_categories_service,
    create_category_service,
    update_category_service,
    delete_category_service,
    get_category_by_id_service,
    get_products_by_category_service
} from "../Services/CategoryService";

// Context global
const CategoryContext = createContext({});

// Provider
const CategoryProvider = (props) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllCategories();
    }, []);

    // GET ALL
    const getAllCategories = async () => {
        setLoading(true);
        try {
            const result = await get_categories_service();
            if (result.status === 200) {
                setCategories(result.data);
            }
        } catch (error) {
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    // GET BY ID
    const getCategoryById = async (id) => {
        setLoading(true);
        try {
            const result = await get_category_by_id_service(id);
            return result.data;
        } catch (error) {
            setError("Failed to get category");
        } finally {
            setLoading(false);
        }
    };

    // CREATE
    const createCategory = async (categoryData, image = null) => {
        setLoading(true);
        try {
            const result = await create_category_service(categoryData, image);
            await getAllCategories();
            return result;
        } catch (error) {
            setError("Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    // UPDATE
    const updateCategory = async (id, categoryData, image = null) => {
        setLoading(true);
        try {
            const result = await update_category_service(id, categoryData, image);
            await getAllCategories();
            return result;
        } catch (error) {
            setError("Failed to update category");
        } finally {
            setLoading(false);
        }
    };

    // DELETE
    const deleteCategory = async (id) => {
        setLoading(true);
        try {
            const result = await delete_category_service(id);
            await getAllCategories();
            return result;
        } catch (error) {
            setError("Failed to delete category");
        } finally {
            setLoading(false);
        }
    };


    const getAllProductsByCategory = async (id) => {
        setLoading(true);
        try {
            const result = await get_products_by_category_service(id);
            return result.data;
        } catch (error) {
            setError("Failed to get category");
        } finally {
            setLoading(false);
        }
    };


    const values = {
        categories,
        loading,
        error,
        getAllCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
        getAllProductsByCategory
    };

    return (
        <CategoryContext.Provider value={values}>
            {props.children}
        </CategoryContext.Provider>
    );
};

const useCategoryContext = () => {
    return useContext(CategoryContext);
};

export { CategoryProvider, useCategoryContext };