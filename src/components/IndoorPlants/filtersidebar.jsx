import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import './indoor_plants.css';

const filters = {
    'Product Type': ['Indoor Plants', 'Preorder'],
    'Indoor Light': ['Low / Artificial', 'Partial / Bright Indirect', 'Direct Sunlight'],
    'Plant Size': ['MD (1-2 FT)', 'LG (1.5-2.5 FT)', 'XL (2-3 FT)', 'XXL (3-5 FT)'],
    Difficulty: ['No Fuss', 'Moderate'],
    'Pet Friendly': ['Yes'],
    'Air Cleaner': ['Yes'],
    Price: ['$50-$100', '$100-$150', '$150-$200'],
};

const FilterSidebar = () => {
    return (
        <Container fluid className="px-5 py-3">
            {Object.entries(filters).map(([category, options], i) => (
                <Row className="filter-section mb-4" key={i}>
                    <Col>
                        <details className="filter-details">
                            <summary className="section-header d-flex align-items-center">
                                {category}
                                <span className="ms-auto ">
                                    <ChevronDown className="chevron-down" />
                                    <ChevronUp className="chevron-up" />
                                </span>
                            </summary>
                            <Form className="mt-2">
                                {options.map((label, idx) => (
                                    <Form.Check
                                        type="checkbox"
                                        id={`${category} ${idx}`}
                                        key={idx}
                                        label={label}
                                        className="mb-2"
                                    />
                                ))}
                            </Form>
                        </details>
                    </Col>
                </Row>
            ))}

            {/* Buttons */}
            <Row className="mt-4">
                <Col>
                    <div className="button-container">
                        <Button variant="outline-secondary" className="clear-filter">
                            Clear Filters
                        </Button>
                        <Button variant="outline-primary" className="btn-info">
                            Size Guide
                        </Button>
                        <Button variant="outline-primary" className="btn-info">
                            About Our Pots
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default FilterSidebar;
