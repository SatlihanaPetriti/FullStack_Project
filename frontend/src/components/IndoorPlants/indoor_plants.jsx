import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Alert,
  Button,
  Offcanvas
} from 'react-bootstrap';

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
  const {
    products,
    loading,
    error: contextError,
    getAllProducts
  } = useProductContext();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getActualPrice = (product) => {
    if (product.sale_percentage) {
      return (
        product.price -
        (product.price * product.sale_percentage) / 100
      );
    }

    return Number(product.price);
  };

  const getDisplayProducts = () => {
    const filtered = products.filter((p) => {
      const byKeyword = p.title
        ?.toLowerCase()
        .includes(searchTerm);

      if (!byKeyword) return false;

      if (filters.categories.length > 0) {
        const catId = p.category_id ?? p.category?.id;

        if (!filters.categories.includes(catId)) {
          return false;
        }
      }

      if (filters.priceRanges.length > 0) {
        const actual = getActualPrice(p);

        const inRange = filters.priceRanges.some((key) => {
          const range = PRICE_RANGES.find(
            (r) => r.key === key
          );

          return (
            range &&
            actual >= range.min &&
            actual <= range.max
          );
        });

        if (!inRange) return false;
      }

      if (
        filters.onSalePercent &&
        !p.sale_percentage
      ) {
        return false;
      }

      if (
        filters.sizes.length > 0 &&
        !filters.sizes.includes(p.size)
      ) {
        return false;
      }

      return true;
    });

    const sorted = [...filtered];

    if (sortOption === 'low') {
      sorted.sort(
        (a, b) =>
          getActualPrice(a) - getActualPrice(b)
      );
    }

    if (sortOption === 'high') {
      sorted.sort(
        (a, b) =>
          getActualPrice(b) - getActualPrice(a)
      );
    }

    return {
      filtered,
      sorted
    };
  };

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearchInput(value);
    setSearchTerm(
      value.trim().toLowerCase()
    );
  };

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
    setSearchInput('');
    setSortOption('featured');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner
          animation="border"
          variant="primary"
        />

        <p className="mt-3">
          Loading beautiful plants...
        </p>
      </Container>
    );
  }

  if (contextError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>
            Connection Error
          </Alert.Heading>

          <p>{contextError}</p>

          <Button
            variant="outline-danger"
            onClick={() => getAllProducts()}
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <Alert.Heading>
            No Products Found
          </Alert.Heading>

          <p>
            Check back later for our beautiful
            plants!
          </p>
        </Alert>
      </Container>
    );
  }

  const { filtered, sorted } =
    getDisplayProducts();

  return (
    <>
      <div className="indoor-plant py-2">
        <Container fluid>

          {/* HEADER / TOOLBAR */}
          <Row className="align-items-center mb-4 mt-2 px-3 px-md-4 gy-3">

            <Col xs={12} lg={5}>
              <h2 className="title-edit">
                All Plants
              </h2>

              <p className="text-muted mb-0 total-products">
                {sorted.length}{' '}
                product
                {sorted.length !== 1
                  ? 's'
                  : ''}

                {filtered.length !==
                  products.length &&
                  ` (filtered from ${products.length})`}
              </p>
            </Col>

            <Col xs={12} lg={7}>
              <div className="products-toolbar">

                {/* SEARCH */}
                <input
                  type="text"
                  placeholder="Search by keywords"
                  className="simple-search"
                  value={searchInput}
                  onChange={handleSearch}
                />

                {/* FILTER BUTTON */}
                <Button
                  variant="outline-dark"
                  className="filters-btn"
                  onClick={() =>
                    setShowFilters(true)
                  }
                >
                  Filters
                </Button>

                {/* SORT */}
                <Form.Select
                  onChange={(e) =>
                    setSortOption(
                      e.target.value
                    )
                  }
                  value={sortOption}
                  className="custom-sort-select"
                >
                  <option value="featured">
                    Sort By
                  </option>

                  <option value="low">
                    Price: Low to High
                  </option>

                  <option value="high">
                    Price: High to Low
                  </option>
                </Form.Select>

              </div>
            </Col>
          </Row>

          {/* PRODUCTS */}
          <Row>
            <Col xs={12}>

              {sorted.length === 0 ? (
                <Alert variant="warning">
                  No products match your
                  criteria.{' '}

                  <span
                    className="clear-filters-link"
                    onClick={
                      handleClearAll
                    }
                  >
                    Clear filters
                  </span>
                </Alert>
              ) : (
                <Row
                  xs={1}
                  sm={2}
                  md={3}
                  xl={4}
                  className="g-4"
                >
                  {sorted.map(
                    (product) => (
                      <Col key={product.id}>
                        <PlantCard
                          product={
                            product
                          }
                        />
                      </Col>
                    )
                  )}
                </Row>
              )}

            </Col>
          </Row>

        </Container>
      </div>

      {/* FILTERS OFFCANVAS */}
      <Offcanvas
        show={showFilters}
        onHide={() =>
          setShowFilters(false)
        }
        placement="start"
        className="filters-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Filters
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>

          <FilterSidebar
            filters={filters}
            onChange={setFilters}
          />

          <div className="filters-actions">

            <Button
              variant="outline-secondary"
              onClick={handleClearAll}
            >
              Clear All
            </Button>

            <Button
              variant="dark"
              onClick={() =>
                setShowFilters(false)
              }
            >
              Show {sorted.length}{' '}
              Product
              {sorted.length !== 1
                ? 's'
                : ''}
            </Button>

          </div>

        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default IndoorPlants;