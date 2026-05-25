import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { Container } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Heart, HeartFill, Bag, BagFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../Context/Product';
import { useFavorites } from '../../Context/Favorite';
import { useCartContext } from '../../Context/CartContext';
import 'swiper/css';
import 'swiper/css/free-mode';
import './pagination.css';


const BASE_URL = "http://localhost:3000/products/uploads/variants";


const getDisplayPrice = (product) => {
  if (product.sale_percentage) {
    const discounted = product.price - (product.price * product.sale_percentage) / 100;
    return discounted.toFixed(2);
  }
  return Number(product.price).toFixed(2);
};

const isNewArrival = (product) => {
  if (product.label === "NEW") return true;
  if (!product.date_added) return false;
  const daysSinceAdded = (Date.now() - new Date(product.date_added).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceAdded <= 30;
};

const getUniqueVariants = (variants = []) =>
  variants
    .filter(v => v.image)
    .filter((v, i, arr) => arr.findIndex(x => x.image === v.image) === i);

// ProductCard
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { cart, addToCart, removeFromCart } = useCartContext();

  const uniqueVariants = getUniqueVariants(product.variants);
  const [activeVariant, setActiveVariant] = useState(uniqueVariants[0] ?? null);
  const [favLoading, setFavLoading] = useState(false);

  const isFavorite = favorites.some(f => f.product_id === product.id);
  const cartItem = cart?.items?.find(item => item.product_id === product.id);
  const inCart = !!cartItem;

  const handleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      isFavorite ? await removeFavorite(product.id) : await addFavorite(product.id);
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleCart = async () => {
    if (inCart) {
      await removeFromCart(cartItem.id);
    } else {
      await addToCart(product.id, 1);
    }
  };


  return (
    <div className="collection-card">

      {/* IMAGE */}
      <div className="image-wrapper">
        <img
          src={`${BASE_URL}/${activeVariant?.image}`}
          alt={product.title}
        />

        {/* FAVORITE */}
        <button className="heart-bag" onClick={handleFavorite} disabled={favLoading}>
          {isFavorite ? <HeartFill size={25} color="red" /> : <Heart size={25} />}
        </button>

        {/* VARIANT THUMBNAILS */}
        {uniqueVariants.length > 1 && (
          <div className="variant-thumbnails">
            {uniqueVariants.map(v => (
              <button
                key={v.id}
                className={`variant-thumb-btn ${activeVariant?.id === v.id ? "active-thumb" : ""}`}
                onClick={() => setActiveVariant(v)}
              >
                <img src={`${BASE_URL}/${v.image}`} alt="variant" />
              </button>
            ))}
          </div>
        )}

        {/* BOTTOM ACTIONS */}
        <div className="bottom-buttons">
          <button className="order-now" onClick={() => navigate(`/product/${product.id}`)}>
            Order Now
          </button>
          <button className="cart-bag" onClick={handleCart}>
            {inCart ? <BagFill size={18} /> : <Bag size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// NewArrivalsSlider

const NewArrivalsSlider = () => {
  const { products, loading } = useProductContext();
  // if (loading || !Array.isArray(products)) return null;
  const newArrivals = products.filter(isNewArrival);

  if (loading) return null;

  return (
    <div className="slider-container">

      {/* HEADER */}
      <Container fluid className="p-0 py-5 d-flex align-items-center justify-content-between">
        <h1 className="m-0 text-productonsale">New Arrivals</h1>
        <div className="slider-arrows">
          <button className="slider-arrow prev"><ChevronLeft size={22} /></button>
          <button className="slider-arrow next"><ChevronRight size={22} /></button>
        </div>
      </Container>

      {/* SLIDER */}
      <Swiper
        slidesPerView="auto"
        spaceBetween={30}
        slidesOffsetBefore={30}
        grabCursor
        freeMode={{ enabled: true }}
        navigation={{ prevEl: '.slider-arrow.prev', nextEl: '.slider-arrow.next' }}
        modules={[FreeMode, Navigation]}
      >
        {newArrivals.map(product => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default NewArrivalsSlider;