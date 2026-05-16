import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Heart, HeartFill, Bag, BagFill } from "react-bootstrap-icons";
import { useFavorites } from "../../Context/Favorite";
import { useCartContext } from "../../Context/CartContext";
import { useNavigate } from 'react-router-dom';
import './indoor_plants.css';

const PlantCard = ({ product }) => {
    const hasVariants = product.variants && product.variants.length > 0;
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const { addToCart, removeFromCart, cart } = useCartContext();
    const navigate = useNavigate();

    const [selectedVariant, setSelectedVariant] = useState(
        hasVariants ? product.variants[0] : { type: 'Default', id: 'default' }
    );

    const [showCartButton, setShowCartButton] = useState(false);

    const isFavorite = favorites.some(f => f.product_id === product.id);
    const cartItem = cart?.items?.find(item => item.product_id === product.id);
    const added = !!cartItem;

    const handleCartClick = async (e) => {
        e.stopPropagation();
        try {
            if (added) {
                await removeFromCart(cartItem.id);
            } else {
                await addToCart(product.id, 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavClick = (e) => {
        e.stopPropagation();
        isFavorite ? removeFavorite(product.id) : addFavorite(product.id);
    };

    const handleVariantClick = (e, variant) => {
        e.stopPropagation();
        setSelectedVariant(variant);
    };

    const getPrice = () => {
        if (product.sale_percentage) {
            const calculatedSale = product.price - (product.price * product.sale_percentage / 100);
            return (
                <>
                    <span className="old-price">${product.price}</span>
                    <span className="sale-price">${calculatedSale.toFixed(2)}</span>
                </>
            );
        }
        return <span>${product.price}</span>;
    };

    const renderLabels = () => {
        const labels = [];
        if (product.label) {
            labels.push(
                <span key="label" className={`label ${product.label.toLowerCase()}`}>
                    {product.label.replace('_', ' ')}
                </span>
            );
        }
        if (product.sale_percentage) {
            labels.push(
                <span key="sale" className="label sale">
                    SALE {product.sale_percentage}% OFF
                </span>
            );
        }
        return labels;
    };

    const IMAGE_BASE_URL = "http://localhost:3000/products/uploads/variants";

    const holderImage = () => {
        const imageName = selectedVariant?.image;
        if (!imageName) return null;
        return (
            <img
                src={`${IMAGE_BASE_URL}/${imageName}`}
                alt={selectedVariant?.type || product.title}
                className="plant-image"
            />
        );
    };

    return (
        <Card
            className="plant-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <div
                className="image-wrapper"
                onMouseEnter={() => setShowCartButton(true)}
                onMouseLeave={() => setShowCartButton(false)}
            >
                <div className="labels-container">
                    {renderLabels()}
                </div>

                {holderImage()}

                <Button
                    variant={added ? "success" : "dark"}
                    className={`cart-btn ${showCartButton ? 'show' : ''}`}
                    onClick={handleCartClick}
                >
                    {added ? (
                        <><BagFill size={15} className="me-1 mb-1" /> Remove</>
                    ) : (
                        <><Bag size={15} className="me-1 mb-1" /> Add to Cart</>
                    )}
                </Button>

                <div className="fav-icon" onClick={handleFavClick}>
                    {isFavorite ? <HeartFill size={25} color="red" /> : <Heart size={25} />}
                </div>
            </div>

            <Card.Body className="details">
                <div className="title-row">
                    <Card.Title className="title">{product.title}</Card.Title>
                    <div className="price">{getPrice()}</div>
                </div>
                <div className="info-row">
                    <div className="color-buttons">
                        {(product.variants || []).map((variant) => (
                            <button
                                key={variant.id}
                                onClick={(e) => handleVariantClick(e, variant)}
                                className={`
                                    color-btn 
                                    color-${variant.type?.toLowerCase() || 'default'}
                                    ${selectedVariant?.id === variant.id ? 'active' : ''}
                                `}
                                title={variant.type}
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