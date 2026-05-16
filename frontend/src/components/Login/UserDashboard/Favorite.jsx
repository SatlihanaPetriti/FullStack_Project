import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../../Context/Favorite";
import { Heart } from "lucide-react";
import "./Favorite.css";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const DashboardFavorites = () => {
    const { favorites, removeFavorite } = useFavorites();
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();

    const handleRemove = async (e, id) => {
        e.stopPropagation();
        setRemovingId(id);
        try {
            await removeFavorite(id);
        } finally {
            setRemovingId(null);
        }
    };

    const getPrice = (product) => {
        if (product.sale_percentage)
            return product.price - (product.price * product.sale_percentage) / 100;
        return Number(product.price);
    };

    const getDiscount = (product) => {
        if (product.sale_percentage)
            return Math.round(product.sale_percentage);
        return null;
    };

    const getImage = (product) => {
        const img = product?.variants?.[0]?.image;
        return img ? `${BASE_URL}/${img}` : null;
    };

    if (!favorites.length) {
        return (
            <div className="fav-empty">
                <p className="fav-empty-title">No favorites yet</p>
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
                    const hasDiscount = !!product.sale_percentage;
                    const discount = getDiscount(product);

                    const isFavorite = favorites.some(
                        (f) => f.product_id === product_id
                    );

                    return (
                        <li
                            key={id}
                            className={`fav-item ${removingId === product_id ? "fav-item--removing" : ""}`}
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            {/* IMAGE */}
                            <div className="fav-img">
                                {image ? (
                                    <img src={image} alt={product.title} />
                                ) : (
                                    <div className="fav-img-placeholder" />
                                )}
                            </div>

                            {/* INFO */}
                            <div className="fav-info">
                                <p className="fav-name">{product.title}</p>
                                <span className="fav-cat">
                                    {product?.category?.name || "No category"}
                                </span>
                            </div>

                            {/* PRICE */}
                            <div className="fav-price-wrap">
                                {hasDiscount && (
                                    <span className="fav-price-old">
                                        €{Number(product.price).toFixed(2)}
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

                            {/* HEART REMOVE */}
                            <button
                                className="fav-remove"
                                onClick={(e) => handleRemove(e, product_id)}
                                aria-label="Remove from favorites"
                            >
                                <Heart
                                    size={16}
                                    fill={isFavorite ? "#c0392b" : "none"}
                                    stroke="#c0392b"
                                />
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* FOOTER */}
            <div className="fav-footer">
                <span>
                    {favorites.length} saved item
                    {favorites.length !== 1 ? "s" : ""}
                </span>
            </div>
        </div>
    );
};

export default DashboardFavorites;