import { useState } from 'react';
import { Container, Row, Col, Form, Spinner, Alert, Button } from 'react-bootstrap';
import PlantCard from './plantcard';
import FilterSidebar from './filtersidebar/';
import { useProductContext } from '../../Context/Product';
import './indoor_plants.css';

const PRICE_RANGES = [
  { key: '50-100', min: 50, max: 100 },
  { key: '100-150', min: 100, max: 150 },
  { key: '150-200', min: 150, max: 200 },
];

const DEFAULT_FILTERS = {
  categories: [],
  priceRanges: [],
  sizes: [],
  onSalePercent: false,
};

const IndoorPlants = () => {
  const { products, loading, error: contextError, getAllProducts } = useProductContext();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const getActualPrice = (product) => {
    if (product.sale_percentage)
      return product.price - (product.price * product.sale_percentage / 100);
    return Number(product.price);
  };

  const getDisplayProducts = () => {
    const filtered = products.filter((p) => {
      const byKeyword = p.title?.toLowerCase().includes(searchTerm);
      if (!byKeyword) return false;

      if (filters.categories.length > 0) {
        const catId = p.category_id ?? p.category?.id;
        if (!filters.categories.includes(catId)) return false;
      }

      if (filters.priceRanges.length > 0) {
        const actual = getActualPrice(p);
        const inRange = filters.priceRanges.some((key) => {
          const range = PRICE_RANGES.find((r) => r.key === key);
          return range && actual >= range.min && actual <= range.max;
        });
        if (!inRange) return false;
      }

      if (filters.onSalePercent && !p.sale_percentage) return false;
      if (filters.sizes.length > 0 && !filters.sizes.includes(p.size)) return false;

      return true;
    });

    const sorted = [...filtered];
    if (sortOption === 'low') sorted.sort((a, b) => getActualPrice(a) - getActualPrice(b));
    if (sortOption === 'high') sorted.sort((a, b) => getActualPrice(b) - getActualPrice(a));

    return { filtered, sorted };
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setSearchTerm(e.target.value.trim().toLowerCase());
  };

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
    setSearchInput('');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading beautiful plants...</p>
      </Container>
    );
  }

  if (contextError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Connection Error</Alert.Heading>
          <p>{contextError}</p>
          <Button variant="outline-danger" onClick={() => getAllProducts()}>Try Again</Button>
        </Alert>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <Alert.Heading>No Products Found</Alert.Heading>
          <p>Check back later for our beautiful plants!</p>
        </Alert>
      </Container>
    );
  }

  const { filtered, sorted } = getDisplayProducts();

  return (
    <div className="indoor-plant py-2">
      <Container fluid>
        <Row className="align-items-center mb-5 mt-2 px-3 px-md-4 gy-3">
          <Col xs={12} md={6}>
            <h2 className="title-edit">All Plants</h2>

            <p className="text-muted mb-0 total-products">
              {sorted.length} product{sorted.length !== 1 ? 's' : ''}
              {filtered.length !== products.length &&
                ` (filtered from ${products.length})`}
            </p>
          </Col>

          <Col xs={12} md={6}>
            <div className="products-toolbar">
              <input
                type="text"
                placeholder="Search by keywords"
                className="simple-search"
                value={searchInput}
                onChange={handleSearch}
              />

              <Form.Select
                onChange={(e) => setSortOption(e.target.value)}
                value={sortOption}
                className="custom-sort-select"
              >
                {sortOption === 'featured' && (
                  <option value="featured">Sort By</option>
                )}

                <option value="low">Sort by Price: Low to High</option>
                <option value="high">Sort by Price: High to Low</option>
              </Form.Select>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <FilterSidebar filters={filters} onChange={setFilters} />
          </Col>
          <Col md={9}>
            {sorted.length === 0 ? (
              <Alert variant="warning">
                No products match your criteria.{' '}
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={handleClearAll}
                >
                  Clear filters
                </span>
              </Alert>
            ) : (
              <Row xs={1} sm={2} lg={3} className="g-4">
                {sorted.map((product) => (
                  <Col key={product.id}>
                    <PlantCard product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default IndoorPlants;