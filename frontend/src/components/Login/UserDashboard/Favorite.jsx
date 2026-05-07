import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartFill } from "react-bootstrap-icons";
import { useFavorites } from "../../../Context/Favorite";
import "./Favorite.css";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const DashboardFavorites = () => {
    const { favorites, removeFavorite } = useFavorites();
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();

    const handleRemove = async (e, id) => {
        e.stopPropagation();
        setRemovingId(id);
        await removeFavorite(id);
    };

    const getPrice = (product) => {
        if (product.sale_price) 
            return Number(product.sale_price);
        if (product.sale_percentage) 
            return product.price - (product.price * product.sale_percentage) / 100;
        return Number(product.price);
    };

    const getImage = (product) => {
        const img = product?.variants?.[0]?.image;
        return img ? `${BASE_URL}/${img}` : null;
    };

    if (!favorites.length) {
        return (
            <div className="dbfav-empty">
                <HeartFill size={28} />
                <p>No favorites yet</p>
                <span>Start saving products you like</span>
            </div>
        );
    }

    return (
        <div className="dbfav-root">

            <div className="dbfav-header">
                <HeartFill size={14} />
                <span className="dbfav-title">Favorites</span>
                <span className="dbfav-pill">{favorites.length}</span>
            </div>

            <ul className="dbfav-list">
                {favorites.map(({ id, product, product_id }) => {
                    if (!product) 
                        return null;

                    const image = getImage(product);
                    const price = getPrice(product);
                    const hasDiscount = product.sale_price || product.sale_percentage;

                    return (
                        <li
                            key={id}
                            className={`dbfav-item ${removingId === product_id ? "dbfav-item--removing" : ""}`}
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <div className="dbfav-img">
                                {image
                                    ? <img src={image} alt={product.title} />
                                    : <div className="dbfav-img-placeholder" />
                                }
                            </div>

                            <div className="dbfav-info">
                                <p className="dbfav-name">{product.title}</p>
                                <span className="dbfav-category">{product?.category?.name || "No category"}</span>
                            </div>

                            <div className="dbfav-price-wrap">
                                {hasDiscount && (
                                    <span className="dbfav-price-old">€{Number(product.price).toFixed(2)}</span>
                                )}
                                <span className="dbfav-price">€{price.toFixed(2)}</span>
                            </div>

                            <button className="dbfav-remove" onClick={(e) => handleRemove(e, product_id)}>
                                <HeartFill size={13} />
                            </button>
                        </li>
                    );
                })}
            </ul>

        </div>
    );
};

export default DashboardFavorites;