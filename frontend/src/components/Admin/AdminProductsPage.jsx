import { useState, useEffect } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import axios from "axios";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
const AdminProductsPage = () => {
    //products- holds product from backend
    const [products, setProducts] = useState([]);
    //edit product(when null-create, when has data-edit)
    const [selectedProduct, setSelectedProduct] = useState(null);
    //shows/close modal true/false
    const [showForm, setShowForm] = useState(false);


    // load all products
    const loadData = async () => {
        try {
            const result = await axios.get("http://localhost:3000/products");
            console.log("Products:", result.data);
            setProducts(result.data);
        } catch (err) {
            console.error("Error loading products:", err);
            alert("Cannot connect to backend");
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    //kur klikohet edit
    const handleEdit = (product) => {
        console.log("Editing product:", product);
        setSelectedProduct(product);
        setShowForm(true);
    };
    //kur klikohet add product
    const handleAdd = () => {
        console.log("Adding new product");
        setSelectedProduct(null); //create mode empty form
        setShowForm(true);
    };
    //close form
    const handleCloseForm = () => {
        console.log("Closing form");
        setShowForm(false);
        setSelectedProduct(null);
    };
    //save the new product and the new changes
    const handleSave = async (productData) => {
        try {
            let response;
            if (selectedProduct) {
                response = await axios.put(`http://localhost:3000/products/${selectedProduct.id}`, productData);
                alert("Product updated successfully!");
            } else {
                response = await axios.post("http://localhost:3000/products", productData);
                alert("Product created successfully!");
            }
            loadData();
            setShowForm(false);
            setSelectedProduct(null);

        } catch (err) {
            console.error("Save error:", err);
            const message = err.response?.data?.message || err.message;
            alert(`Failed to save product: ${message}`);
        }
    };

    return (
        <>
            <Container fluid>
                <h1 className=" mt-4">Admin Dashboard - Products</h1>
                <Button
                    className="mb-4 mt-4 "
                    variant="primary"
                    onClick={handleAdd}>
                    + Add Product
                </Button>

                {products.length === 0 ? (
                    <Alert variant="info">
                        No products found. Click <strong>"Add Product"</strong> to create one.
                    </Alert>
                ) : (
                    <ProductTable
                        //component with props 
                        products={products}//Parent-child prop1(prop name left, prop value right) what to display
                        onEdit={handleEdit}//child-parent prop2(what to do when editing)
                        loadData={loadData}// child-parent prp3(how to reload the data)
                    />
                )}

                {showForm && ( //show and hide form 
                    <ProductForm
                        show={showForm}
                        product={selectedProduct}
                        onClose={handleCloseForm}
                        onSave={handleSave}
                    />
                )}
            </Container>
        </>
    );
};

export default AdminProductsPage;