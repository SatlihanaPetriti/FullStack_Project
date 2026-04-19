import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { Container } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Heart, HeartFill, Bag, BagFill } from 'react-bootstrap-icons';
import { useState } from 'react';
import { useProductContext } from '../../Context/Product';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../Context/Favorite';
import { useCartContext } from '../../Context/CartContext';
import 'swiper/css';
import 'swiper/css/free-mode';
import './pagination.css';

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const isFavoriteProduct = (favorites, productId) =>
  favorites.some(fav => fav.product_id === productId);

const getDisplayPrice = (product) => {
  if (product.sale_price) return Number(product.sale_price).toFixed(2);
  if (product.sale_percentage) {
    const discounted = product.price - (product.price * product.sale_percentage) / 100;
    return discounted.toFixed(2);
  }
  return Number(product.price).toFixed(2);
};

const isNewArrival = (product) => {
  const isLabelNew = product.label === "NEW";
  const isRecent = !product.date_added ? false :
    (Date.now() - new Date(product.date_added).getTime()) / (1000 * 60 * 60 * 24) <= 30;
  return isLabelNew || isRecent;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, favorites } = useFavorites();
  const { addToCart, removeFromCart, cart } = useCartContext();

  const [favLoading, setFavLoading] = useState(false);

  const uniqueVariants = (product.variants ?? [])
    .filter(v => v.image)
    .filter((v, i, arr) => arr.findIndex(x => x.image === v.image) === i);

  const [activeVariant, setActiveVariant] = useState(uniqueVariants[0] ?? null);

  const isFavorite = isFavoriteProduct(favorites, product.id);
  const added = cart?.items?.some(item => item.product_id === product.id) ?? false;

  const handleFavorite = async (e) => {
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

  const handleAddToCart = async (e) => {
    try {
      if (added) {
        const cartItem = cart?.items?.find(item => item.product_id === product.id);
        if (cartItem) await removeFromCart(cartItem.id);
      } else {
        await addToCart(product.id, 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="collection-card">
      <div className="image-wrapper">
        <img src={`${BASE_URL}/${activeVariant?.image}`} alt={product.title} />

        <button className="heart-bag" onClick={handleFavorite} disabled={favLoading}>
          {isFavorite ? <HeartFill size={25} color="red" /> : <Heart size={25} />}
        </button>

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

        <div className="bottom-buttons">
          <button className="order-now" onClick={() => navigate(`/product/${product.id}`)}>
            Order Now
          </button>

          <button className="cart-bag" onClick={handleAddToCart}>
            {added ? <BagFill size={18} /> : <Bag size={18} />}
          </button>
        </div>
      </div>

      <div className="product-info">
        <h6>{product.title}</h6>
        <div className="price-wrapper">
          {(product.sale_price || product.sale_percentage) && (
            <span className="old-price">€{Number(product.price).toFixed(2)}</span>
          )}
          <span className="new-price">€{getDisplayPrice(product)}</span>
        </div>
      </div>
    </div>
  );
};

const NewArrivalsSlider = () => {
  const { products, loading } = useProductContext();
  const newArrivals = products.filter(isNewArrival);

  if (loading) return null;

  return (
    <div className='slider-container'>
      <Container fluid className='p-0 py-5 d-flex align-items-center justify-content-between'>
        <h1 className='m-0 text-productonsale'>New Arrivals</h1>
        <div className='slider-arrows'>
          <button className='slider-arrow prev'><ChevronLeft size={22} /></button>
          <button className='slider-arrow next'><ChevronRight size={22} /></button>
        </div>
      </Container>

      <Swiper
        slidesPerView='auto'
        spaceBetween={30}
        slidesOffsetBefore={30}
        grabCursor
        freeMode={{ enabled: true }}
        navigation={{ prevEl: '.slider-arrow.prev', nextEl: '.slider-arrow.next' }}
        modules={[FreeMode, Navigation]}
      >
        {newArrivals.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewArrivalsSlider;