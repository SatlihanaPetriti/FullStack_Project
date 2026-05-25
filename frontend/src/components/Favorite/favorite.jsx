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

    const favoritesCount = favorites.length;

    const getImage = (product) => {
        const image = product?.variants?.[0]?.image;
        return image ? `${BASE_URL}/${image}` : null;
    };

    const getPrice = (product) =>
        product.sale_percentage
            ? product.price - (product.price * product.sale_percentage) / 100
            : Number(product.price);

    const goToProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    const removeFromFavorites = async (e, productId) => {
        e.stopPropagation();
        setRemovingId(productId);
        await removeFavorite(productId);
        setRemovingId(null);
    };

    if (favoritesCount === 0) {
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
            <div className="fav-header">
                <div className="fav-header-left">
                    <span className="fav-title">Favorites</span>
                    <span className="fav-pill">{favoritesCount}</span>
                </div>
                <span className="fav-subtitle">Favorite products</span>
            </div>

            <ul className="fav-list">
                {favorites.map((favorite, index) => {
                    const product = favorite.product;
                    if (!product) return null;

                    const image = getImage(product);
                    const price = getPrice(product);

                    return (
                        <li
                            key={favorite.id}
                            className={`fav-item ${removingId === favorite.product_id ? "fav-item--removing" : ""}`}
                            style={{ animationDelay: `${index * 0.05}s`, cursor: "pointer" }}
                            onClick={() => goToProduct(product.id)}
                        >
                            <div className="fav-image">
                                {image ? (
                                    <img src={image} alt={product.title} />
                                ) : (
                                    <div className="fav-image-placeholder" />
                                )}
                            </div>

                            <div className="fav-info">
                                <p className="fav-name">{product.title}</p>
                                <span className="fav-category">
                                    {product?.category?.name || "No category"}
                                </span>
                            </div>

                            <div className="fav-price-wrap">
                                {product.sale_percentage && (
                                    <span className="fav-price-old">
                                        €{Number(product.price).toFixed(2)}
                                    </span>
                                )}
                                <span className="fav-price">
                                    €{price.toFixed(2)}
                                </span>
                            </div>

                            <div className="fav-actions">
                                <button
                                    className="fav-action-btn fav-heart-btn"
                                    onClick={(e) => removeFromFavorites(e, favorite.product_id)}
                                    title="Remove from favorites"
                                >
                                    <HeartFill size={16} />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {favoritesCount > 3 && (
                <div className="fav-scroll-hint">Scroll to see more ↓</div>
            )}
        </div>
    );
};

export default FavoritesList;