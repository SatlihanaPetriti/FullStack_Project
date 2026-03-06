import { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { useProductContext } from '../../Context/Product';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import ProductFilters from './ProductFilters';

const AdminProductsPage = () => {
    const {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        getAllProducts,
    } = useProductContext();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]); // NEW: for filtered products

    // Handlers 
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedProduct(null);
    };

    const handleSave = async (productData) => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, productData);
                alert('Product updated successfully!');
            } else {
                await createProduct(productData);
                alert('Product created successfully!');
            }
            setShowForm(false);
            setSelectedProduct(null);
        } catch (err) {
            console.error('Save error:', err);
            alert(`Failed to save product: ${err.message}`);
        }
    };

    // NEW: Handle filter changes from ProductFilters
    const handleFilterChange = (filtered) => {
        setFilteredProducts(filtered);
    };

    // Decide which products to display
    const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

    // Loading state
    if (loading && products.length === 0) {
        return (
            <Container fluid className="p-4">
                <h2 className="mb-4 fw-bold">Products</h2>
                <Alert variant="info">Loading products...</Alert>
            </Container>
        );
    }

    // Error state 
    if (error) {
        return (
            <Container fluid className="p-4">
                <h2 className="mb-4 fw-bold">Products</h2>
                <Alert variant="danger">
                    Error: {error}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-3"
                        onClick={getAllProducts}>
                        Try Again
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4">

            {/*Page title + Add button*/}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Products</h2>
                <Button variant="success" onClick={handleAdd}>
                    + Add Product
                </Button>
            </div>

            {/* Table or empty state */}
            {products.length === 0 ? (
                <Alert variant="info">
                    No products found. Click <strong>"Add Product"</strong> to create one.
                </Alert>
            ) : (
                <>
                    {/* NEW: Add ProductFilters here */}
                    <ProductFilters
                        products={products}
                        onFilterChange={handleFilterChange}
                    />

                    <div className="table-responsive">
                        <ProductTable
                            products={displayProducts} 
                            onEdit={handleEdit}
                            onDelete={deleteProduct}
                        />
                    </div>
                </>
            )}

            {/* Add / Edit modal */}
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