// plantcard.jsx
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import './indoor_plants.css';

const PlantCard = ({ product }) => {
    // Safety check: if no variants, don't try to select one
    const hasVariants = product.variants && product.variants.length > 0;

    //tracks variant of pots user has selected - with fallback
    const [selectedVariant, setSelectedVariant] = useState(
        hasVariants ? product.variants[0] : { type: 'Default', id: 'default' }
    );

    //show/hide cart "add to cart"
    const [showCartButton, setShowCartButton] = useState(false);

    //show original and sale price (if it has)
    const getPrice = () => {
        if (product.sale_price) {
            return (
                <>
                    <span className="old-price">${product.price}</span>
                    <span className="sale-price">${product.sale_price}</span>
                </>
            );
        }

        //calculate the discount (if no % show regular price)
        if (product.sale_percentage) {
            const calculatedSale = product.price - (product.price * product.sale_percentage / 100);
            return (
                <>
                    <span className="old-price">${product.price}</span>
                    <span className="sale-price">
                        ${calculatedSale.toFixed(2)}
                    </span>
                </>
            );
        }
        return <span>${product.price}</span>;
    };

    const renderLabels = () => {
        const labels = [];
        // Add label from API
        if (product.label) {
            labels.push(
                <span key="label" className={`label ${product.label.toLowerCase()}`}>
                    {product.label.replace('_', ' ')}
                </span>
            );
        }

        // Add SALE label if sale_percentage exists
        if (product.sale_percentage) {
            labels.push(
                <span key="sale" className="label sale">
                    SALE {product.sale_percentage}% OFF
                </span>
            );
        }

        return labels;
    };

    // imageholder - with safety check
    const holderImage = () => {
        const displayText = selectedVariant?.type || 'Plant';
        return (
            <div className="image-placeholder">
                <span>{displayText}</span>
            </div>
        );
    };

    // If no variants at all, show a simplified card
    if (!hasVariants) {
        return (
            <Card className="plant-card">
                <div
                    className="image-wrapper"
                    onMouseEnter={() => setShowCartButton(true)}
                    onMouseLeave={() => setShowCartButton(false)}>
                    <div className="labels-container">
                        {renderLabels()}
                    </div>
                    <div className="image-placeholder">
                        <span>{product.title}</span>
                    </div>
                    <Button
                        variant="dark"
                        className={`cart-btn ${showCartButton ? 'show' : ''}`}>
                        Add to Cart
                    </Button>
                </div>

                <Card.Body className="details">
                    <div className="title-row">
                        <Card.Title className="title">{product.title}</Card.Title>
                        <div className="price">{getPrice()}</div>
                    </div>
                    <div className="info-row">
                        <div className="color-buttons">
                            <span className="text-muted small">No variants</span>
                        </div>
                        <span className="size-badge">{product.size}</span>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    // Normal rendering with variants
    return (
        <Card className="plant-card">
            <div
                className="image-wrapper"
                onMouseEnter={() => setShowCartButton(true)}
                onMouseLeave={() => setShowCartButton(false)}>
                <div className="labels-container">
                    {renderLabels()}
                </div>
                {holderImage()}
                <Button
                    variant="dark"
                    className={`cart-btn ${showCartButton ? 'show' : ''}`}>
                    Add to Cart
                </Button>
            </div>

            <Card.Body className="details">
                <div className="title-row">
                    <Card.Title className="title">{product.title}</Card.Title>
                    <div className="price">{getPrice()}</div>
                </div>
                <div className="info-row">
                    <div className="color-buttons">
                        {product.variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`
                                    color-btn 
                                    color-${variant.type?.toLowerCase() || 'default'}
                                    ${selectedVariant?.id === variant.id ? 'active' : ''}
                                `}
                                title={variant.type} //show name on hover
                            />
                        ))}
                    </div>

                    <span className="size-badge">{product.size}</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PlantCard;