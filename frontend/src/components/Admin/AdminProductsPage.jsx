import { useState } from "react";
import { Container, Alert } from "react-bootstrap";

import { useProductContext } from "../../Context/Product";

import ProductForm from "./CreateEditModal/ProductForm";
import Products from "./Products";

const AdminProductsPage = () => {
    const {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        onAddStock,
    } = useProductContext();

    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openAddForm = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };

    const openEditForm = (product) => {
        setSelectedProduct(product);
        setShowForm(true);
    };

    const closeForm = () => {
        setSelectedProduct(null);
        setShowForm(false);
    };

    const saveProduct = async (productData, images) => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, productData, images);
            } else {
                await createProduct(productData, images);
            }

            closeForm();
        } catch (err) {
            alert(`Failed to save: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <Container className="py-4">
                <Alert variant="info">Loading products...</Alert>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-4">
                <Alert variant="danger">Error: {error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4">
            <Products
                products={products}
                onAdd={openAddForm}
                onEdit={openEditForm}
                onDelete={deleteProduct}
                onAddStock={onAddStock}
            />

            {showForm && (
                <ProductForm
                    show={showForm}
                    product={selectedProduct}
                    onClose={closeForm}
                    onSave={saveProduct}
                    allProducts={products}
                />
            )}
        </Container>
    );
};

export default AdminProductsPage;