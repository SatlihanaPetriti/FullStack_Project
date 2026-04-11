import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { Container } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Heart, HeartFill, Bag, BagFill } from 'react-bootstrap-icons';
import { useState } from 'react';
import { useProductContext } from '../../context/Product.jsx';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/free-mode';
import './pagination.css';

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const isNewArrival = (product) => {
  const isLabelNew = product.label === "NEW";
  const isRecent = (() => {
    if (!product.date_added) return false;
    const diffDays = (Date.now() - new Date(product.date_added).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  })();
  return isLabelNew || isRecent;
};

// Extracted as its own component so hooks work correctly (no hooks inside .map())
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  // All variants that have images, deduplicated by image filename
  const uniqueVariants = (product.variants ?? [])
    .filter(v => v.image)
    .filter((v, i, arr) => arr.findIndex(x => x.image === v.image) === i);

  const [activeVariant, setActiveVariant] = useState(uniqueVariants[0] ?? null);

  const hasDiscount = !!product.sale_price || !!product.sale_percentage;
  const displayPrice = product.sale_price
    ? Number(product.sale_price).toFixed(2)
    : product.sale_percentage
      ? (Number(product.price) * (1 - product.sale_percentage / 100)).toFixed(2)
      : Number(product.price).toFixed(2);

  return (
    <div className='collection-card'>
      <div className='image-wrapper'>
        {/* Main image from active variant */}
        <img
          src={`${BASE_URL}/${activeVariant?.image}`}
          alt={product.title}
        />

        {/* Wishlist button */}
        <button
          className='heart-bag'
          onClick={() => setLiked(prev => !prev)}
        >
          {liked ? <HeartFill size={25} /> : <Heart size={25} />}
        </button>

        {/* Variant image thumbnails — type NOT shown */}
        {uniqueVariants.length > 1 && (
          <div className='variant-thumbnails'>
            {uniqueVariants.map((variant) => (
              <button
                key={variant.id}
                className={`variant-thumb-btn ${activeVariant?.id === variant.id ? 'active-thumb' : ''}`}
                onClick={() => setActiveVariant(variant)}
              >
                <img
                  src={`${BASE_URL}/${variant.image}`}
                  alt=""
                />
              </button>
            ))}
          </div>
        )}

        <div className='bottom-buttons'>
          {/* Order Now navigates to /product/:id */}
          <button
            className='order-now'
            onClick={() =>
              navigate(`/product/${product.id}`, {
                state: { product }
              })
            }
          >
            Order Now
          </button>

          <button
            className='cart-bag'
            onClick={() => setAdded(prev => !prev)}
          >
            {added ? <BagFill size={18} /> : <Bag size={18} />}
          </button>
        </div>
      </div>

      {/* Product info — type NOT displayed */}
      <div className='product-info'>
        <h6>{product.title}</h6>
        <div className='price-wrapper'>
          {hasDiscount && (
            <span className='old-price'>€{Number(product.price).toFixed(2)}</span>
          )}
          <span className='new-price'>€{displayPrice}</span>
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
        navigation={{
          prevEl: '.slider-arrow.prev',
          nextEl: '.slider-arrow.next',
        }}
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