import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';
import './ViewProducts.css'; 

const ViewProducts = () => {
    const [products, setProducts] = useState([]);

    const getTotalStock = (variants) => {
        return variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    };
    const getPriceAfterDiscount = (product) => {
        if (product.sale_price) {
            return `$${product.sale_price}`;
        }
        if (product.sale_percentage) {
            const discounted = product.price - (product.price * product.sale_percentage) / 100;
            return `$${discounted.toFixed(2)} (${product.sale_percentage}% off)`;
        }
        return `$${product.price}`;
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/products');
                setProducts(response.data);
            } catch (err) {
                setError('Failed to load products.');
            }
        };
        loadData();
    }, []);

    return (
        <Container fluid className="py-4">
            
            <h1 className="mb-4">All Products (View Only)</h1>

            <Table bordered hover size="sm" className="w-100 align-middle view-products-table">
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
                        <th>Total Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td><strong>{product.id}</strong></td>
                            <td>{product.title}</td>
                            <td>
                                <div className="d-flex flex-wrap gap-2">
                                    {product.label && (
                                        <span className="badge bg-warning text-dark">
                                            {product.label}
                                        </span>
                                    )}

                                    {/* Sale percentage label */}
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
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* footer */}
            <div className="mt-3 text-muted">
                <small>Total Products: {products.length}</small>
                {' | '}
                <small>Total Items in Stock: {
                    products.reduce((sum, p) => sum + getTotalStock(p.variants), 0)
                }</small>
            </div>
        </Container>
    );
};

export default ViewProducts;