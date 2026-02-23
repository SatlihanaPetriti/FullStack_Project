import { Table, Button, Container } from "react-bootstrap";
import axios from "axios";


//products- the list of products to display
//onEdit- Function to call when edit clicked
//loadData- to refresh after edit or delete
const ProductTable = ({ products, onEdit, loadData }) => {

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`http://localhost:3000/products/${id}`);
            loadData();
            alert("Product deleted successfully!");
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product.");
        }
    };
    //total stock from variants
    const getTotalStock = (variants) => variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

    //claculate price after discount
    //nese ka sale_price return sale_price nese jo return sale_%, if not sale_% return original price
    const getPriceAfterDiscount = (product) => {
        if (product.sale_price)
            return `$${product.sale_price}`;
        if (product.sale_percentage) {
            const discounted = product.price - (product.price * product.sale_percentage) / 100;
            return `$${discounted.toFixed(2)} (${product.sale_percentage}% off)`;
        }
        return `$${product.price}`;
    };

    return (
        <Container fluid className="px-0">
            <Table
                bordered
                hover
                size="sm"
                className="w-100 align-middle"
            >
                <thead className="bg-light">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Label</th>
                        <th>Category</th>
                        <th>Size</th>
                        <th>Original</th>
                        <th>Sale</th>
                        <th>% Off</th>
                        <th>Final Price</th>
                        <th>Variants (Type: Stock)</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td><strong>{product.id}</strong></td>
                            <td><small>{product.title}</small></td>
                            <td>
                                <div className=" d-flex flex-wrap gap-2">
                                    {/* Main lable */}
                                    {product.label && (
                                        <span className="badge bg-warning text-dark">
                                            {product.label}
                                        </span>
                                    )}

                                    {/* Sale % */}
                                    {product.sale_percentage && (
                                        <span className="badge bg-danger">
                                            SALE {product.sale_percentage}%
                                        </span>
                                    )}

                                </div>
                            </td>
                            <td>{product.category}</td>
                            <td>{product.size}</td>
                            <td>${product.price}</td>
                            <td>{product.sale_price ? `$${product.sale_price}` : '-'}</td>
                            <td>{product.sale_percentage ? `${product.sale_percentage}%` : '-'}</td>
                            <td className="fw-bold">{getPriceAfterDiscount(product)}</td>
                            <td>
                                {product.variants?.map((v) => (
                                    <div key={v.id}>
                                        {v.type}: {v.stock}
                                    </div>
                                ))}
                            </td>
                            <td className="fw-bold text-center">{getTotalStock(product.variants)}</td>
                            <td>
                                <Button size="sm" variant="primary" className="me-2 mb-1" onClick={() => onEdit(product)}>Edit</Button>
                                <Button size="sm" variant="danger" className="mb-1" onClick={() => handleDelete(product.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ProductTable;