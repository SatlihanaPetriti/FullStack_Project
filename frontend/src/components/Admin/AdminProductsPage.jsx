import { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { useProductContext } from '../../Context/Product';
import ProductForm from './ProductForm';
import ProductFilters from './ProductFilters';
import ImageModal from './ImageModal';

const AdminProductsPage = () => {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProductContext();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    // state for image modal
    const [showImages, setShowImages] = useState(false);
    const [selectedProductForImages, setSelectedProductForImages] = useState(null);

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

    // function to handle showing images
    const handleShowImages = (product) => {
        setSelectedProductForImages(product);
        setShowImages(true);
    };

    // function to handle closing images
    const handleCloseImages = () => {
        setShowImages(false);
        setSelectedProductForImages(null);
    };

    const handleSave = async (productData, images) => {
            try {
            const existingProduct = products.find(p => p.id === productData.id);

            if (existingProduct) {
                await updateProduct(productData.id, productData, images);
            } else {
                await createProduct(productData, images);
            }

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
                    <ProductFilters
                        products={products}
                        onEdit={handleEdit}
                        onDelete={deleteProduct}
                        onViewImages={handleShowImages} 
                    />
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

            {/* Image Modal */}
            {showImages && selectedProductForImages && (
                <ImageModal
                    key={selectedProductForImages.id}
                    show={showImages}
                    product={selectedProductForImages}
                    onClose={handleCloseImages}
                />
            )}
        </Container>
    );
};

export default AdminProductsPage;