import { useState } from 'react';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import ProductTable from './ProductTable';

const ProductFilters = ({ products, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [stockStatus, setStockStatus] = useState('All');
    const [saleStatus, setSaleStatus] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');
    const [sortBy, setSortBy] = useState('featured');

    // get total stock of a product
    function getTotalStock(variants) {
        return !variants?.length ? 0 : variants.reduce((sum, v) => sum + v.stock, 0);
    }
    // !variants?.length is true when the array is missing or empty.
//If condition is true(!variants?.length) → return 0
// If condition is false → return sum of stocks
    //If there’s no array or it’s empty, return 0. Otherwise, sum the stock.

    //  get actual price after sale/discount
    function getActualPrice(product) {
        if (product.sale_price) {
            return parseFloat(product.sale_price); // parseFloat një string në numër (decimal).
        }

        if (product.sale_percentage) {
            let discount = product.price * (product.sale_percentage / 100);
            let priceAfterDiscount = product.price - discount;
            return Math.round(priceAfterDiscount * 100) / 100; // round to 2 decimals
        }

        return parseFloat(product.price);
    }

    // Filter products
    const filteredProducts = products.filter(product => {
        // 1. Search filter
        const lowerSearch = searchTerm.toLowerCase();
        let matchesSearch = product.title.toLowerCase().includes(lowerSearch) ||
            product.id.toString().includes(lowerSearch);

        // 2. Category filter
        let matchesCategory = category === 'All' || product.category === category;

        // 3. Stock filter
        const stock = getTotalStock(product.variants);
        let matchesStock = stockStatus === 'In Stock' ? stock > 0
            : stockStatus === 'Low Stock (Total)' ? stock > 0 && stock <= 5
                : stockStatus === 'Low Stock (Variant)' ? product.variants?.some(v => v.stock <= 5)
                    : stockStatus === 'Out of Stock' ? stock === 0
                        : true;

        // 4. Sale filter
        let matchesSale = saleStatus === 'On Sale' ? !!product.sale_price
            : saleStatus === 'Sale Percentage' ? !!product.sale_percentage
                : saleStatus === 'Regular Price' ? !product.sale_price && !product.sale_percentage
                    : true; // show all products if no filter

        // 5. Price filter
        const actualPrice = getActualPrice(product);
        let matchesPrice = priceFilter === 'under50' ? actualPrice <= 50
            : priceFilter === 'over50' ? actualPrice > 50
                : true;

        return matchesSearch && matchesCategory && matchesStock && matchesSale && matchesPrice;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price_low') return getActualPrice(a) - getActualPrice(b);
        if (sortBy === 'price_high') return getActualPrice(b) - getActualPrice(a);
        if (sortBy === 'newest') return new Date(b.date_added) - new Date(a.date_added);
        if (sortBy === 'oldest') return new Date(a.date_added) - new Date(b.date_added);
        return 0;
    });

    // Get categories for dropdown
    const allCategories = products
        .map(p => p.category)
        .filter(cat => cat);

    const uniqueCategories = [...new Set(allCategories)]; // liste pa dublikime
    const categories = ['All', ...uniqueCategories];  // Reset all filters
    
    const resetFilters = () => {
        setSearchTerm('');
        setCategory('All');
        setStockStatus('All');
        setSaleStatus('All');
        setPriceFilter('All');
        setSortBy('featured');
    };


    return (
        <>
            <div className="product-filters p-4 mb-4 bg-light rounded">

                {/* Search Bar */}
                <Row className="g-3 mb-4">
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label className="fw-bold text-muted small">SEARCH</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="filter-control">
                                    <Search size={20} />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by product name or ID..."
                                    value={searchTerm} // shfaq vleren aktuale nga state searchTerm(input)
                                    onChange={e => setSearchTerm(e.target.value)} //perditeson state
                                    className="filter-control"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Filters Row */}
                <Row className="g-3">

                    {/* Category */}
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="fw-bold text-muted small">CATEGORY</Form.Label>
                            <Form.Select
                                value={category} // SFAQ CILA ESHTE ZGJEDHUR
                                // perditeson state kur ndryshon zgjedhja
                                onChange={e => setCategory(e.target.value)}> 
                                {categories.map(c =>
                                    <option key={c} value={c}>{c}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Stock Status */}
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="fw-bold text-muted small">STOCK STATUS</Form.Label>
                            <Form.Select
                                value={stockStatus}
                                onChange={e => setStockStatus(e.target.value)}>
                                <option>All</option>
                                <option>In Stock</option>
                                <option>Low Stock (Total)</option>
                                <option>Low Stock (Variant)</option>
                                <option>Out of Stock</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Sale Status */}
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="fw-bold text-muted small">SALE STATUS</Form.Label>
                            <Form.Select
                                value={saleStatus}
                                onChange={e => setSaleStatus(e.target.value)}>
                                <option>All</option>
                                <option>On Sale</option>
                                <option>Sale Percentage</option>
                                <option>Regular Price</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Price Filter */}
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="fw-bold text-muted small">PRICE RANGE</Form.Label>
                            <Form.Select
                                value={priceFilter}
                                onChange={e => setPriceFilter(e.target.value)}>
                                <option>All</option>
                                <option value="under50">Under $50</option>
                                <option value="over50">Over $50</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Sort & Reset */}
                <Row className="g-3 mt-2">

                    <Col md={8}>
                        <Form.Group>
                            <Form.Label className="fw-bold text-muted small">SORT BY</Form.Label>
                            <Form.Select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}>
                                <option value="featured">Featured</option>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Label className="fw-bold text-muted small">RESET</Form.Label>
                        <Button
                            variant="outline-secondary"
                            className="w-100"
                            onClick={resetFilters}>
                            Reset All Filters
                        </Button>
                    </Col>
                </Row>
            </div>
            <ProductTable products={sortedProducts} onEdit={onEdit} onDelete={onDelete} />
        </>
    );
};

export default ProductFilters;