// AdminProductsPage.jsx
import { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { useProductContext } from '../../Context/Product';
import ProductForm from './ProductForm';
import ProductFilters from './ProductFilters';

const AdminProductsPage = () => {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProductContext();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleEdit = (product) => { setSelectedProduct(product); setShowForm(true); };
    const handleAdd = () => { setSelectedProduct(null); setShowForm(true); };
    const handleCloseForm = () => { setShowForm(false); setSelectedProduct(null); };
    const handleSave = async (productData) => {
        try {
            if (selectedProduct) await updateProduct(selectedProduct.id, productData);
            else await createProduct(productData);
            setShowForm(false);
            setSelectedProduct(null);
        } catch (err) {
            alert(`Failed to save: ${err.message}`);
        }
    };

    if (loading) 
        return <Container><Alert>Loading products...</Alert></Container>;
    if (error) 
        return <Container><Alert>Error: {error}</Alert></Container>;

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Products</h2>
                <Button variant="success" onClick={handleAdd}>+ Add Product</Button>
            </div>

            {products.length === 0 ? (
                <Alert variant="info">No products found. Click "Add Product" to create one.</Alert>
            ) : (
                <>
                    {/* Pass products to ProductFilters, ProductFilters computes filtering/sorting internally */}
                    <ProductFilters products={products} onEdit={handleEdit} onDelete={deleteProduct} />
                </>
            )}

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