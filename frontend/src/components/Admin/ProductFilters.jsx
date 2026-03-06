import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import './ProductFilters.css';

const ProductFilters = ({ products, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [stockStatus, setStockStatus] = useState('All');
    const [saleStatus, setSaleStatus] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('featured');

    // Helper function to calculate total stock
    const getTotalStock = (variants) => {
        return variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    };

    // Helper function to get final price after discount
    const getActualPrice = (product) => {
        if (product.sale_price) {
            return product.sale_price;
        }
        if (product.sale_percentage) {
            const discounted = product.price - (product.price * product.sale_percentage / 100);
            return Math.round(discounted * 100) / 100;
        }
        return product.price;
    };

    // Filter and sort products whenever any filter changes
    useEffect(() => {
        // First, filter the products
        let filtered = products.filter((product) => {
            // Search by title or ID
            const matchesSearch = searchTerm === '' ||
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.id.toString().includes(searchTerm);

            // Filter by category
            const matchesCategory = category === 'All' || product.category === category;

            // Filter by stock status
            const stock = getTotalStock(product.variants);
            let matchesStock = true;

            if (stockStatus === 'In Stock') {
                matchesStock = stock > 0;
            }
            else if (stockStatus === 'Low Stock (Total)') {
                // Total product stock is low (≤3)
                matchesStock = stock > 0 && stock <= 3;
            }
            else if (stockStatus === 'Low Stock (Variant)') {
                // ANY variant has low stock (≤3) - including zero
                matchesStock = product.variants?.some(v => v.stock <= 3) || false;
            }
            else if (stockStatus === 'Out of Stock') {
                matchesStock = stock === 0;
            }

            // Filter by sale status
            const isOnSale = product.sale_price || product.sale_percentage;
            let matchesSale = true;
            if (saleStatus === 'On Sale') {
                matchesSale = isOnSale;
            } else if (saleStatus === 'Regular Price') {
                matchesSale = !isOnSale;
            }

            // Filter by price range
            const actualPrice = getActualPrice(product);
            const matchesMinPrice = priceRange.min === '' || actualPrice >= Number(priceRange.min);
            const matchesMaxPrice = priceRange.max === '' || actualPrice <= Number(priceRange.max);

            return matchesSearch && matchesCategory && matchesStock && matchesSale &&
                matchesMinPrice && matchesMaxPrice;
        });

        // Then, sort the filtered products
        if (sortBy === 'price_low') {
            filtered.sort((a, b) => getActualPrice(a) - getActualPrice(b));
        } else if (sortBy === 'price_high') {
            filtered.sort((a, b) => getActualPrice(b) - getActualPrice(a));
        } else if (sortBy === 'newest') {
            filtered.sort((a, b) => {
                const dateA = new Date(a.date_added || 0);
                const dateB = new Date(b.date_added || 0);
                return dateB - dateA;
            });
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => {
                const dateA = new Date(a.date_added || 0);
                const dateB = new Date(b.date_added || 0);
                return dateA - dateB;
            });
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        // Send filtered products back to parent
        onFilterChange(filtered);
    }, [products, searchTerm, category, stockStatus, saleStatus, priceRange, sortBy]);

    // Get unique categories for dropdown
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setCategory('All');
        setStockStatus('All');
        setSaleStatus('All');
        setPriceRange({ min: '', max: '' });
        setSortBy('featured');
    };

    return (
        <div className="product-filters p-4 mb-4 bg-light rounded">
            {/* Search Bar */}
            <Row className="g-3 mb-4">
                <Col md={12}>
                    <InputGroup>
                        <InputGroup.Text className="filter-control">
                            <Search size={20} />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by product name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="filter-control"
                        />
                    </InputGroup>
                </Col>
            </Row>

            {/* Filters Row  */}
            <Row className="g-3">
                {/* Category Filter */}
                <Col md={3} sm={6}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted small">CATEGORY</Form.Label>
                        <Form.Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="filter-select"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Stock Status Filter */}
                <Col md={3} sm={6}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted small">STOCK STATUS</Form.Label>
                        <Form.Select
                            value={stockStatus}
                            onChange={(e) => setStockStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Stock</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock (Total)">Low Stock (Total ≤3)</option>
                            <option value="Low Stock (Variant)">Low Stock (Any Variant ≤3)</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Sale Status Filter */}
                <Col md={3} sm={6}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted small">SALE STATUS</Form.Label>
                        <Form.Select
                            value={saleStatus}
                            onChange={(e) => setSaleStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Items</option>
                            <option value="On Sale">On Sale</option>
                            <option value="Regular Price">Regular Price</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Sort By */}
                <Col md={3} sm={6}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted small">SORT BY</Form.Label>
                        <Form.Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="featured">Featured</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="name">Name A-Z</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Price Range Row */}
            <Row className="g-3 mt-2">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted small">MIN PRICE ($)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            className="filter-control"
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted small">MAX PRICE ($)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            className="filter-control"
                        />
                    </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                    <Button
                        variant="outline-secondary"
                        onClick={resetFilters}
                        className="w-100"
                    >
                        Reset All Filters
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default ProductFilters;