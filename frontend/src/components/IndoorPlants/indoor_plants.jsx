import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert,Button } from 'react-bootstrap';
import PlantCard from './plantcard';
import FilterSidebar from './filtersidebar/';
import { useProductContext } from '../../Context/Product'; 
import './indoor_plants.css';

const IndoorPlants = () => {
  
  const { products, loading, error: contextError, getAllProducts } = useProductContext();

  const [sortOption, setSortOption] = useState('featured');
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setSortedProducts([...products]);
    } else {
      setSortedProducts([]);
    }
  }, [products]);

  
  const getActualPrice = (product) => {
    if (product.sale_price) {
      return product.sale_price;
    }
    if (product.sale_percentage) {
      const discountedPrice = product.price - (product.price * product.sale_percentage / 100);
      return Math.round(discountedPrice * 100) / 100;
    }
    return product.price;
  };
  
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);

    const productsToSort = [...products]; 

    if (value === 'low') {
      productsToSort.sort((a, b) => getActualPrice(a) - getActualPrice(b));
    } else if (value === 'high') {
      productsToSort.sort((a, b) => getActualPrice(b) - getActualPrice(a));
    } else if (value === 'new') {
      productsToSort.sort((a, b) => {
        const dateA = new Date(a.date_added || 0);
        const dateB = new Date(b.date_added || 0);
        return dateB - dateA;
      });
    } else {
      setSortedProducts([...products]);
      return;
    }

    setSortedProducts(productsToSort);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading beautiful plants...</p>
      </Container>
    );
  }

  // Show error state
  if (contextError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Connection Error</Alert.Heading>
          <p>{contextError}</p>
          <Button variant="outline-danger" onClick={() => getAllProducts()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  // Show empty state
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
    <div className="indoor-plant">
      <Container fluid>
        <Row className="align-items-center ms-4 mb-5 mt-5">
          <Col md={6}>
            <h2 className='title-edit'>Indoor Plants</h2>
          </Col>
          <Col md={6} className="d-flex justify-content-md-end">
            <Form.Select
              onChange={handleSortChange}
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
            <FilterSidebar products={products} /> 
          </Col>

          <Col md={9}>
            {sortedProducts.length === 0 ? (
              <Alert variant="warning">
                No products match your criteria.
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