import CarouselBootstrap from '../../components/CarouselBootstrap';
import FooterHome from '../../components/Footer';
import PaginationSlider from '../../components/pagination_slider/pagination';
import FeaturedSection from '../../components/FeaturedIn/featured_in';
import TestimonialSection from '../../components/Testimonial/testimonial'

const HomePage = () => {
    return (
        <div>
            <CarouselBootstrap />
            <FeaturedSection />
            <TestimonialSection />
            <PaginationSlider />
            <FooterHome />
        </div>
    );
}

export default HomePage;
