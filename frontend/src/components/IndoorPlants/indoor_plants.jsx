import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import PlantCard from './plantcard';
import FilterSidebar from './filtersidebar/';
import axios from 'axios';
import './indoor_plants.css';
import '../../Pages/IndoorPlants/index.css';

const IndoorPlants = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('featured');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        console.log('Adding products:', response.data);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products.');
      } 
    };
    loadData();
  }, []);

  //to get the actual price or final price the customer payes after all discounts
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

  // Handle sort 
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    const sortedProducts = [...products];
    if (value === 'low') {
      sortedProducts.sort((a, b) => getActualPrice(a) - getActualPrice(b));
    } else if (value === 'high') {
      sortedProducts.sort((a, b) => getActualPrice(b) - getActualPrice(a));
    } else if (value === 'new') {
      sortedProducts.sort((a, b) => {
        const dateA = new Date(a.date_added || 0);
        const dateB = new Date(b.date_added || 0);
        return dateB - dateA; 
      });
    }

    setProducts(sortedProducts);
  };

  // Show error state
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Connection Error</Alert.Heading>
          <p>{error}</p>
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
            <FilterSidebar />
          </Col>

          <Col md={9}>
            <Row xs={1} sm={2} lg={3} className="g-4">
              {products.map((product) => (
                <Col key={product.id}>
                  <PlantCard product={product} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default IndoorPlants;