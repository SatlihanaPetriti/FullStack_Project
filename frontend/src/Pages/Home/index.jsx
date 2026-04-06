import CarouselBootstrap from '../../components/CarouselBootstrap';
import FooterHome from '../../components/Footer';
import PaginationSlider from '../../components/pagination_slider/pagination';
import FeaturedSection from '../../components/FeaturedIn/featured_in';
// import TestimonialSection from '../../components/Testimonial/testimonial'
import SubscribeModal from '../../components/newsletter/newsletter';
import SaleSection from '../../components/salesection/salesection';


const HomePage = () => {
    return (
        <>
            <SubscribeModal />
        <div>
            <CarouselBootstrap />
            <FeaturedSection />
            {/* <TestimonialSection /> */}
                <SaleSection />
            <PaginationSlider />
            <FooterHome />
        </div>
        </>
    );
}

export default HomePage;
