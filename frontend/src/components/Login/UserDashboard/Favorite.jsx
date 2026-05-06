import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartFill } from "react-bootstrap-icons";
import { useFavorites } from "../../../Context/Favorite";
import './Favorite.css';


const BASE_URL = "http://localhost:3000/products/uploads/variants";

const DashboardFavorites = () => {
    const { favorites, removeFavorite } = useFavorites();
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();

    const handleRemove = async (e, productId) => {
        e.stopPropagation();
        setRemovingId(productId);
        await removeFavorite(productId);
    };

    const getPrice = (product) => {
        if (product.sale_price) return Number(product.sale_price);
        if (product.sale_percentage)
            return product.price - (product.price * product.sale_percentage) / 100;
        return Number(product.price);
    };

    const isDiscounted = (product) =>
        !!product.sale_price || !!product.sale_percentage;

    const getImage = (product) => {
        const image = product?.variants?.[0]?.image;
        return image ? `${BASE_URL}/${image}` : null;
    };


    return (
        <div className="dbfav-root">
            <div className="dbfav-header">
                <HeartFill size={14} />
                <span className="dbfav-title">Favorites</span>
                <span className="dbfav-pill">{favorites.length}</span>
            </div>

            {favorites.length === 0 ? (
                <div className="dbfav-empty">
                    <HeartFill size={28} />
                    <p>No favorites yet</p>
                    <span>Start saving products you like</span>
                </div>
            ) : (
                <>
                    <ul className="dbfav-list">
                        {favorites.map((fav, i) => {
                            const product = fav.product;
                            if (!product) return null;

                            const image = getImage(product);
                            const price = getPrice(product);
                            const discounted = isDiscounted(product);

                            return (
                                <li
                                    key={fav.id}
                                    className={`dbfav-item ${removingId === fav.product_id ? "dbfav-item--removing" : ""}`}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div className="dbfav-img">
                                        {image
                                            ? <img src={image} alt={product.title} />
                                            : <div className="dbfav-img-placeholder" />}
                                    </div>

                                    <div className="dbfav-info">
                                        <p className="dbfav-name">{product.title}</p>
                                        <span className="dbfav-category">
                                            {product?.category?.name || "No category"}
                                        </span>
                                    </div>

                                    <div className="dbfav-price-wrap">
                                        {discounted && (
                                            <span className="dbfav-price-old">
                                                €{Number(product.price).toFixed(2)}
                                            </span>
                                        )}
                                        <span className="dbfav-price">€{price.toFixed(2)}</span>
                                    </div>

                                    <button
                                        className="dbfav-remove"
                                        onClick={(e) => handleRemove(e, fav.product_id)}
                                        title="Remove from favorites"
                                    >
                                        <HeartFill size={13} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {favorites.length > 4 && (
                        <p className="dbfav-scroll-hint">Scroll to see more ↓</p>
                    )}
                </>
            )}
        </div>
    );
};

export default DashboardFavorites;