import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartFill } from "react-bootstrap-icons";
import { useFavorites } from "../../Context/Favorite";
import "./favorite.css";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const FavoritesList = () => {
    const { favorites, removeFavorite } = useFavorites();
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();

    const handleRemove = async (e, productId) => {
        e.stopPropagation();
        setRemovingId(productId);
        await removeFavorite(productId);
    };

    const handleNavigate = (productId) => {
        navigate(`/product/${productId}`);
    };

    const getPrice = (product) => {
        if (product.sale_percentage)
            return product.price - (product.price * product.sale_percentage) / 100;
        return Number(product.price);
    };

    const isDiscounted = (product) => !!product.sale_percentage;

    const getImage = (product) => {
        const image = product?.variants?.[0]?.image;
        return image ? `${BASE_URL}/${image}` : null;
    };

    if (favorites.length === 0) {
        return (
            <div className="fav-dropdown">
                <li className="fav-empty">
                    <div className="fav-empty-icon">
                        <HeartFill size={24} />
                    </div>
                    <p>No favorites yet</p>
                    <span>Start saving products you like</span>
                </li>
            </div>
        );
    }

    return (
        <div className="fav-dropdown">
            {/* HEADER */}
            <div className="fav-header">
                <div className="fav-header-left">
                    <span className="fav-title">Favorites</span>
                    <span className="fav-pill">{favorites.length}</span>
                </div>
                <span className="fav-subtitle">Favorite products</span>
            </div>

            {/* LIST */}
            <ul className="fav-list">
                {favorites.map((fav, i) => {
                    const product = fav.product;
                    if (!product) return null;

                    const image = getImage(product);
                    const price = getPrice(product);
                    const discounted = isDiscounted(product);

                    return (
                        <li
                            key={fav.id}
                            className={`fav-item ${removingId === fav.product_id ? "fav-item--removing" : ""}`}
                            style={{ animationDelay: `${i * 0.05}s`, cursor: "pointer" }}
                            onClick={() => handleNavigate(product.id)}
                        >
                            {/* IMAGE */}
                            <div className="fav-image">
                                {image
                                    ? <img src={image} alt={product.title} />
                                    : <div className="fav-image-placeholder" />
                                }
                            </div>

                            {/* INFO */}
                            <div className="fav-info">
                                <p className="fav-name">{product.title}</p>
                                <span className="fav-category">
                                    {product?.category?.name || "No category"}
                                </span>
                            </div>

                            {/* PRICE */}
                            <div className="fav-price-wrap">
                                {discounted && (
                                    <span className="fav-price-old">
                                        €{Number(product.price).toFixed(2)}
                                    </span>
                                )}
                                <span className="fav-price">
                                    €{price.toFixed(2)}
                                </span>
                            </div>

                            {/* ACTIONS */}
                            <div className="fav-actions">
                                <button
                                    className="fav-action-btn fav-heart-btn"
                                    onClick={(e) => handleRemove(e, fav.product_id)}
                                    title="Remove from favorites"
                                >
                                    <HeartFill size={16} />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* SCROLL HINT */}
            {favorites.length > 3 && (
                <div className="fav-scroll-hint">Scroll to see more ↓</div>
            )}
        </div>
    );
};

export default FavoritesList;