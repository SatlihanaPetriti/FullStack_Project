import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import './indoor_plants.css';

const PlantCard = ({ plant }) => {
    const [selectedVariant, setSelectedVariant] = useState(plant.variants[0]);
    const [showCartButton, setShowCartButton] = useState(false);

    const getPrice = () => {
        // If salePrice exists
        if (plant.salePrice) {
            return (
                <>
                    <span className="old-price">${plant.price}</span>
                    <span className="sale-price">${plant.salePrice}</span>
                </>
            );
        }

        // If salePercentage exists
        if (plant.salePercentage) {
            const calculatedSale = plant.price - (plant.price * plant.salePercentage / 100);
            return (
                <>
                    <span className="old-price">${plant.price}</span>
                    <span className="sale-price">
                        ${calculatedSale.toFixed(2)}
                    </span>
                </>
            );
        }
        return <span>${plant.price}</span>;
    };


    const renderLabels = () => {
        const labels = [];

        // Add NEW label
        if (plant.label) {
            labels.push(
                <span key="new" className={`label ${plant.label.toLowerCase()}`}>
                    {plant.label.replace('_', ' ')}
                </span>
            );
        }

        // Add SALE label if salePercentage exists
        if (plant.salePercentage) {
            labels.push(
                <span key="sale" className="label sale">
                    SALE {plant.salePercentage}% OFF
                </span>
            );
        }

        return labels;
    };

    return (
        <Card className="plant-card">
            <div
                className="image-wrapper"
                onMouseEnter={() => setShowCartButton(true)}
                onMouseLeave={() => setShowCartButton(false)}
            >
                <div className="labels-container">
                    {renderLabels()}
                </div>

                <Card.Img src={selectedVariant.image} className="plant-image" />

                <Button
                    variant="dark"
                    className={`cart-btn ${showCartButton ? 'show' : ''}`}
                >
                    Add to Cart
                </Button>
            </div>

            <Card.Body className="details">
                <div className="title-row">
                    <Card.Title className="title">{plant.title}</Card.Title>
                    <div className="price">{getPrice()}</div>
                </div>

                <div className="info-row">
                    {/* Color buttons */}
                    <div className="color-buttons">
                        {plant.variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`
                                    color-btn 
                                    color-${variant.type.toLowerCase()}
                                    ${selectedVariant.id === variant.id ? 'active' : ''}
                                `}
                                title={variant.type}
                            />
                        ))}
                    </div>

                    <span className="size-badge">{plant.size}</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PlantCard;