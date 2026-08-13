import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { Heart, HeartFill, Bag, BagFill } from "react-bootstrap-icons";

import { useFavorites } from "../../Context/Favorite";
import { useCartContext } from "../../Context/CartContext";

import "./indoor_plants.css";

const IMAGE_BASE_URL = `${import.meta.env.REACT_APP_BACKEND_URL}/products/uploads/variants`;

const PlantCard = ({ product }) => {
    const navigate = useNavigate();
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const { addToCart, removeFromCart, cart } = useCartContext();

    const variants = product.variants || [];
    const defaultVariant = variants[0] || { type: "Default", id: "default" };

    const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
    const [showCartButton, setShowCartButton] = useState(false);

    const isFavorite = favorites.some((favorite) => favorite.product_id === product.id);
    const cartItem = cart?.items?.find((item) => item.product_id === product.id);
    const isInCart = Boolean(cartItem);

    const imageUrl = selectedVariant?.image ? `${IMAGE_BASE_URL}/${selectedVariant.image}` : null;

    const discountPrice = product.sale_percentage
        ? product.price - (product.price * product.sale_percentage) / 100
        : Number(product.price);

    const goToProduct = () => {
        navigate(`/product/${product.id}`);
    };

    const handleCartClick = async (e) => {
        e.stopPropagation();

        try {
            if (isInCart) await removeFromCart(cartItem.id);
            else await addToCart(product.id, 1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();

        if (isFavorite) removeFavorite(product.id);
        else addFavorite(product.id);
    };

    const handleVariantClick = (e, variant) => {
        e.stopPropagation();
        setSelectedVariant(variant);
    };

    return (
        <Card className="plant-card" style={{ cursor: "pointer" }} onClick={goToProduct}>
            <div
                className="image-wrapper"
                onMouseEnter={() => setShowCartButton(true)}
                onMouseLeave={() => setShowCartButton(false)}
            >
                <div className="labels-container">
                    {product.label && (
                        <span className={`label ${product.label.toLowerCase()}`}>
                            {product.label.replace("_", " ")}
                        </span>
                    )}

                    {product.sale_percentage && (
                        <span className="label sale">
                            SALE {product.sale_percentage}% OFF
                        </span>
                    )}
                </div>

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={selectedVariant?.type || product.title}
                        className="plant-image"
                    />
                )}

                <Button
                    variant={isInCart ? "success" : "dark"}
                    className={`cart-btn ${showCartButton ? "show" : ""}`}
                    onClick={handleCartClick}
                >
                    {isInCart ? (
                        <>
                            <BagFill size={15} className="me-1 mb-1" />
                            Remove
                        </>
                    ) : (
                        <>
                            <Bag size={15} className="me-1 mb-1" />
                            Add to Cart
                        </>
                    )}
                </Button>

                <div className="fav-icon" onClick={handleFavoriteClick}>
                    {isFavorite ? (
                        <HeartFill size={25} color="red" />
                    ) : (
                        <Heart size={25} />
                    )}
                </div>
            </div>

            <Card.Body className="details">
                <div className="title-row">
                    <Card.Title className="title">{product.title}</Card.Title>

                    <div className="price">
                        {product.sale_percentage ? (
                            <>
                                <span className="old-price">${product.price}</span>
                                <span className="sale-price">${discountPrice.toFixed(2)}</span>
                            </>
                        ) : (
                            <span>${product.price}</span>
                        )}
                    </div>
                </div>

                <div className="info-row">
                    <div className="color-buttons">
                        {variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={(e) => handleVariantClick(e, variant)}
                                className={`
                                    color-btn
                                    color-${variant.type?.toLowerCase() || "default"}
                                    ${selectedVariant?.id === variant.id ? "active" : ""}
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