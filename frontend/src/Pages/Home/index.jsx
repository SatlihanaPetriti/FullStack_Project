import CarouselBootstrap from '../../components/CarouselBootstrap';
import FooterHome from '../../components/Footer';
import PaginationSlider from '../../components/pagination_slider/pagination';
import FeaturedSection from '../../components/FeaturedIn/featured_in';
import SubscribeModal from '../../components/newsletter/newsletter';


const HomePage = () => {
    return (
        <>
            <SubscribeModal />
        <div>
            <CarouselBootstrap />
            <FeaturedSection />
            <PaginationSlider />
            <FooterHome />
        </div>
        </>
    );
}

export default HomePage;
