import { useState, useMemo } from 'react';
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
  onSalePrice: false,
};

const IndoorPlants = () => {
  const { products, loading, error: contextError, getAllProducts } = useProductContext();
  const [sortOption, setSortOption] = useState('featured');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const getActualPrice = (product) => {
    if (product.sale_price) return Number(product.sale_price);
    if (product.sale_percentage)
      return product.price - (product.price * product.sale_percentage / 100);
    return Number(product.price);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {

      // Category — provo category_id direkt, pastaj category?.id si fallback
      if (filters.categories.length > 0) {
        const catId = p.category_id ?? p.category?.id;
        if (!filters.categories.includes(catId)) return false;
      }

      // Price ranges
      if (filters.priceRanges.length > 0) {
        const actual = getActualPrice(p);
        const inRange = filters.priceRanges.some((key) => {
          const range = PRICE_RANGES.find((r) => r.key === key);
          return range && actual >= range.min && actual <= range.max;
        });
        if (!inRange) return false;
      }

      // Offers
      if (filters.onSalePercent && !p.sale_percentage) return false;
      if (filters.onSalePrice && !p.sale_price) return false;

      // Size
      if (filters.sizes.length > 0 && !filters.sizes.includes(p.size)) return false;

      return true;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    if (sortOption === 'low') return arr.sort((a, b) => getActualPrice(a) - getActualPrice(b));
    if (sortOption === 'high') return arr.sort((a, b) => getActualPrice(b) - getActualPrice(a));
    if (sortOption === 'new') return arr.sort((a, b) => new Date(b.date_added || 0) - new Date(a.date_added || 0));
    return arr;
  }, [filteredProducts, sortOption]);

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

  return (
    <div className="indoor-plant py-5">
      <Container fluid>
        <Row className="align-items-center ms-4 mb-5 mt-5">
          <Col md={6}>
            <h2 className="title-edit">All Plants</h2>
            <p className="text-muted mb-0" style={{ fontSize: 14 }}>
              {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
              {filteredProducts.length !== products.length && ` (filtered from ${products.length})`}
            </p>
          </Col>
          <Col md={6} className="d-flex justify-content-md-end">
            <Form.Select
              onChange={(e) => setSortOption(e.target.value)}
              value={sortOption}
              className="custom-sort-select"
            >
              <option value="featured">Sort by Featured</option>
              <option value="low">Sort by Price: Low to High</option>
              <option value="high">Sort by Price: High to Low</option>
              <option value="new">Sort by Newest</option>
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <FilterSidebar filters={filters} onChange={setFilters} />
          </Col>
          <Col md={9}>
            {sortedProducts.length === 0 ? (
              <Alert variant="warning">
                No products match your criteria.{' '}
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Clear filters
                </span>
              </Alert>
            ) : (
              <Row xs={1} sm={2} lg={3} className="g-4">
                {sortedProducts.map((product) => (
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