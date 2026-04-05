import { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useProductContext } from '../../Context/Product';
import ProductForm from './CreateEditModal/ProductForm';
import Products from './Products';

const AdminProductsPage = () => {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProductContext();

    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

    const handleEdit = (product) => {
        setSelectedProductId(product.id);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedProductId(null);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedProductId(null);
    };

    const handleSave = async (productData, images) => {
        try {
            if (selectedProductId) {
                await updateProduct(selectedProductId, productData, images);
            } else {
                await createProduct(productData, images);
            }
            setShowForm(false);
            setSelectedProductId(null);
        } catch (err) {
            alert(`Failed to save: ${err.message}`);
        }
    };

    if (loading) return <Container className="py-4"><Alert variant="info">Loading products...</Alert></Container>;
    if (error) return <Container className="py-4"><Alert variant="danger">Error: {error}</Alert></Container>;

    return (
        <Container fluid className="p-4">
            <Products
                products={products}
                onEdit={handleEdit}
                onDelete={deleteProduct}
                onAdd={handleAdd}
            />

            {showForm && (
                <ProductForm
                    show={showForm}
                    product={selectedProduct}
                    onClose={handleCloseForm}
                    onSave={handleSave}
                    allProducts={products}
                />
            )}
        </Container>
    );
};

export default AdminProductsPage;