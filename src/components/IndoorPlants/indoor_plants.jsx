import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import PlantCard from './plantcard';
import IndoorData from '../../db/indoorData';
import FilterSidebar from './filtersidebar/';
import './indoor_plants.css';
import '../../Pages/IndoorPlants/index.css';

const IndoorPlants = () => {
  const [sortOption, setSortOption] = useState('featured');
  const [sortedPlants, setSortedPlants] = useState(IndoorData);

  const getActualPrice = (plant) => {
    if (plant.salePrice) {
      return plant.salePrice;
    }
    if (plant.salePercentage) {
      const discountedPrice = plant.price - (plant.price * plant.salePercentage / 100);
      return Math.round(discountedPrice * 100) / 100;
    }
    return plant.price;
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    const plantsCopy = [...IndoorData];

    if (value === 'featured') {
      setSortedPlants([...IndoorData]);
    }
    else if (value === 'low') {
      const sorted = plantsCopy.sort((a, b) => {
        const priceA = getActualPrice(a);
        const priceB = getActualPrice(b);
        return priceA - priceB;
      });
      setSortedPlants(sorted);
    }
    else if (value === 'high') {
      const sorted = plantsCopy.sort((a, b) => {
        const priceA = getActualPrice(a);
        const priceB = getActualPrice(b);
        return priceB - priceA;
      });
      setSortedPlants(sorted);
    }
    else if (value === 'new') {
      const sorted = plantsCopy.sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return dateB - dateA;
      });
      setSortedPlants(sorted);
    }

  };

  return (
    <div className="indoor-plant">
      <Container fluid >
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
          {/* Sidebar */}
          <Col md={3}>
            <FilterSidebar />
          </Col>

          {/* Plant */}
          <Col md={9}>
            <Row xs={1} sm={2} lg={3} className="g-4">
              {sortedPlants.map((plant) => (
                <Col key={plant.id}>
                  <PlantCard plant={plant} />
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