import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { Container } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Heart, HeartFill, Bag, BagFill } from 'react-bootstrap-icons';
import { useState } from 'react';
import { useProductContext } from '../../context/Product.jsx';

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

const NewArrivalsSlider = () => {
  const { products, loading } = useProductContext();
  const [liked, setLiked] = useState({});
  const [added, setAdded] = useState({});

  const newArrivals = products.filter(isNewArrival);

  if (loading) return null;

  return (
    <div className='slider-container'>
      <Container fluid className='p-0 py-5 d-flex align-items-center justify-content-between'>
        <h1 className='text-fp m-0 text-productonsale'>New Arrivals</h1>
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
        {newArrivals.map((product, index) => {
          const firstVariant = product.variants?.[0];
          const hasDiscount = !!product.sale_price || !!product.sale_percentage;
          const displayPrice = product.sale_price
            ? Number(product.sale_price).toFixed(2)
            : product.sale_percentage
              ? (Number(product.price) * (1 - product.sale_percentage / 100)).toFixed(2)
              : Number(product.price).toFixed(2);
          console.log(firstVariant?.image)

          return (
            <SwiperSlide key={product.id}>
              <div className='collection-card'>
                <div className='image-wrapper'>
                  <img
                    src={`${BASE_URL}/${firstVariant?.image}`}
                    alt={product.title}
                  />

                  <button
                    className='heart-bag'
                    onClick={() => setLiked(prev => ({ ...prev, [index]: !prev[index] }))}
                  >
                    {liked[index] ? <HeartFill size={25} /> : <Heart size={25} />}
                  </button>

                  <div className='bottom-buttons'>
                    <button className='order-now'>Order Now</button>
                    <button
                      className='cart-bag'
                      onClick={() => setAdded(prev => ({ ...prev, [index]: !prev[index] }))}
                    >
                      {added[index] ? <BagFill size={18} /> : <Bag size={18} />}
                    </button>
                  </div>
                </div>

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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default NewArrivalsSlider;