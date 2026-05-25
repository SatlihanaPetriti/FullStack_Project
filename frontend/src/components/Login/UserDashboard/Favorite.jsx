import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import { useFavorites } from "../../../Context/Favorite";

import "./Favorite.css";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const DashboardFavorites = () => {
    const { favorites, removeFavorite } = useFavorites();
    const navigate = useNavigate();

    const [removingId, setRemovingId] = useState(null);

    const favoritesCount = favorites.length;

    const getImage = (product) => {
        const image = product?.variants?.[0]?.image;
        return image ? `${BASE_URL}/${image}` : null;
    };

    const getPrice = (product) =>
        product.sale_percentage
            ? product.price - (product.price * product.sale_percentage) / 100
            : Number(product.price);

    const getDiscount = (product) =>
        product.sale_percentage
            ? Math.round(product.sale_percentage)
            : null;

    const handleRemove = async (e, productId) => {
        e.stopPropagation();

        setRemovingId(productId);

        try {
            await removeFavorite(productId);
        } finally {
            setRemovingId(null);
        }
    };

    const goToProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (!favoritesCount) {
        return (
            <div className="fav-empty">
                <p className="fav-empty-title">
                    No favorites yet
                </p>

                <span className="fav-empty-sub">
                    Start saving products you like
                </span>
            </div>
        );
    }

    return (
        <div className="fav-root">
            <ul className="fav-list">
                {favorites.map(({ id, product, product_id }) => {
                    if (!product) return null;

                    const image = getImage(product);
                    const price = getPrice(product);
                    const discount = getDiscount(product);

                    return (
                        <li
                            key={id}
                            className={`fav-item ${removingId === product_id
                                    ? "fav-item--removing"
                                    : ""
                                }`}
                            onClick={() => goToProduct(product.id)}
                        >
                            <div className="fav-img">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={product.title}
                                    />
                                ) : (
                                    <div className="fav-img-placeholder" />
                                )}
                            </div>

                            <div className="fav-info">
                                <p className="fav-name">
                                    {product.title}
                                </p>

                                <span className="fav-cat">
                                    {product?.category?.name ||
                                        "No category"}
                                </span>
                            </div>

                            <div className="fav-price-wrap">
                                {product.sale_percentage && (
                                    <span className="fav-price-old">
                                        €
                                        {Number(
                                            product.price
                                        ).toFixed(2)}
                                    </span>
                                )}

                                <span className="fav-price">
                                    €{price.toFixed(2)}
                                </span>

                                {discount && (
                                    <span className="fav-sale-badge">
                                        −{discount}%
                                    </span>
                                )}
                            </div>

                            <button
                                className="fav-remove"
                                onClick={(e) =>
                                    handleRemove(e, product_id)
                                }
                                aria-label="Remove from favorites"
                            >
                                <Heart
                                    size={16}
                                    fill="#c0392b"
                                    stroke="#c0392b"
                                />
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="fav-footer">
                <span>
                    {favoritesCount} saved item
                    {favoritesCount !== 1 ? "s" : ""}
                </span>
            </div>
        </div>
    );
};

export default DashboardFavorites;