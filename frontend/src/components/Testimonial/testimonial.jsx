import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { Container, Button } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/free-mode';
import './testimonial.css';

import Product1 from '../../assets/images/Home/plant-1.jpg';
import Product2 from '../../assets/images/Home/plant-2.jpg';
import Product3 from '../../assets/images/Home/plant-3.jpg';
import Product4 from '../../assets/images/Home/plant-4.jpg';
import Product5 from '../../assets/images/Home/plant-5.jpg';

const products = [
  { img: Product1, name: 'Fiddle Leaf Fig', originalPrice: 120, salePrice: 90, salePercent: 25 },
  { img: Product2, name: 'Snake Plant', originalPrice: 80, salePrice: 60, salePercent: 25 },
  { img: Product3, name: 'Monstera Deliciosa', originalPrice: 150, salePrice: 120, salePercent: 20 },
  { img: Product4, name: 'Peace Lily', originalPrice: 70, salePrice: 50, salePercent: 30 },
  { img: Product5, name: 'Succulent Pack', originalPrice: 50, salePrice: 40, salePercent: 20 },
];

const ProductSale = () => {
  return (
    <Container fluid className="product-sale-section py-5">

      {/* HEADER */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="sale-text m-0">Product Sale</h1>

        <div className="slider-arrows">
          <button className="slider-arrow prev">
            <ChevronLeft size={20} />
          </button>
          <button className="slider-arrow next">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* SWIPER */}
      <Swiper
        slidesPerView="auto"
        spaceBetween={20}
        grabCursor
        freeMode={{ enabled: true }}
        navigation={{
          prevEl: '.slider-arrow.prev',
          nextEl: '.slider-arrow.next',
        }}
        modules={[FreeMode, Navigation]}
        className="productSwiper"
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <div className="product-card">

              {/* IMAGE */}
              <div className="image-wrapper">
                <img src={product.img} alt={product.name} />

                {/* SALE BADGE */}
                <div className="sale-badge">-{product.salePercent}%</div>

                {/* ❤️ HEART */}
                <FaHeart className="heart-icon" />
              </div>

              {/* INFO */}
              <div className="product-info">
                <h6 className="product-name">{product.name}</h6>

                <div className="product-prices">
                  <span className="sale-price">${product.salePrice}</span>
                  <span className="original-price">${product.originalPrice}</span>
                </div>

                {/* 🛒 BUTTON */}
                <Button className="add-to-cart-btn" variant="success">
                  <FaShoppingCart className="btn-cart-icon" />
                  Add to Cart
                </Button>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </Container>
  );
};

export default ProductSale;