import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import img1 from '../../assets/images/Home/plant_slide_1.jpg';
import img2 from '../../assets/images/Home/plant_slide_2.jpg';
import img3 from '../../assets/images/Home/plant_slide_3.jpg';
import './carousel.css';
import '../../Pages/Home/index.css';
import { Link } from 'react-router-dom';

const CarouselBootstrap = () => {
  return (
    <div className='carousel-wrapper'>
      <Carousel controls={false}>
        {/* First Slide */}
        <Carousel.Item interval={1500}>
          <img src={img1} alt='First slide' className='d-block w-100' />
          <div className='carousel-button-wrapper'>
            <h1 className='carousel-heading'>
              Welcome to a real plant family
            </h1>
            <Link to='/indoor-plants'>
              <Button className='custom-carousel-btn ' size='lg'>
                Shop Our Plants <span className='btn-arrow'>&gt;</span>
              </Button>
            </Link>
          </div>

        </Carousel.Item>

        {/* Second Slide */}
        <Carousel.Item interval={1500}>
          <img src={img2} alt='Second slide' className='d-block w-100' />
          <div className='carousel-button-wrapper'>
            <h1 className='carousel-heading'>Plant life made easy</h1>
            <Link to='/indoor-plants'>
              <Button className='custom-carousel-btn' size='lg'>
                Shop Our Plants <span className='btn-arrow'>&gt;</span>
              </Button>
            </Link>
          </div>
        </Carousel.Item>

        {/* Third Slide */}
        <Carousel.Item interval={1500}>
          <img src={img3} alt='Third slide' className='d-block w-100' />
          <div className='carousel-button-wrapper'>
            <h1 className='carousel-heading'>Gift of a living plant</h1>
            <Link to='/indoor-plants'>
              <Button className='custom-carousel-btn' size='lg'>
                Shop Our Plants <span className='btn-arrow'>&gt;</span>
              </Button>
            </Link>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default CarouselBootstrap;
