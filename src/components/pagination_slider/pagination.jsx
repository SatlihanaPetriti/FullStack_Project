import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { Container } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, ArrowRightShort } from 'react-bootstrap-icons';
import img1 from '../../assets/images/Home/collection-plant-5.jpg';
import img2 from '../../assets/images/Home/collection-plant-2.jpg';
import img3 from '../../assets/images/Home/collection-plant-3.jpg';
import img4 from '../../assets/images/Home/collection-plant-4.jpg';
import img5 from '../../assets/images/Home/collection-plant-6.jpg';
import 'swiper/css';
import 'swiper/css/free-mode';
import './pagination.css';
import '../../Pages/Home/index.css';

const slides = [
  { img: img1, title: 'All Plants', count: '14 items' },
  { img: img2, title: 'All Plants', count: '14 items' },
  { img: img3, title: 'All Plants', count: '14 items' },
  { img: img4, title: 'All Plants', count: '14 items' },
  { img: img5, title: 'All Plants', count: '14 items' },
];

const PaginationSlider = () => {
  return (
    <div className='slider-container'>
      {/* Header */}
      <Container
        fluid
        className='p-0 py-5 d-flex align-items-center justify-content-between'>
        <h1 className='text-fp m-0'>Shop by Collection</h1>

        <div className='slider-arrows'>
          <button className='slider-arrow prev'>
            <ChevronLeft size={22} />
          </button>
          <button className='slider-arrow next'>
            <ChevronRight size={22} />
          </button>
        </div>
      </Container>

      {/* Swiper */}
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
        className='paginationSwiper'>
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className='collection-card'>
              <div className='image-wrapper'>
                <img
                  src={slide.img}
                  alt={`Slide ${index + 1}`}
                />
                <button className='arrow-btn'>
                  <ArrowRightShort
                    size={30}
                    className='rotate-up-right'
                  />
                </button>
              </div>

              <h6 className='mt-3 mb-2'>{slide.title}</h6>
              <small>{slide.count}</small>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PaginationSlider;
