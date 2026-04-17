import { Button } from "react-bootstrap";
import img1 from '../../assets/images/Home/saleimage.png';
import './salesection.css';

const SaleSection = () => {
    return (
        <section
            className="sale-section d-flex align-items-start justify-content-center"
            style={{ backgroundImage: `url(${img1})` }}
        >
            <div className="container text-center text-white sale-content">
                <h2 className="sale-title">
                    Spring into Green - <br />
                    <span className="highlight">25%</span> off all indoor plants!
                </h2>

                <p className="sale-description">
                    Bring life to your home with vibrant,<br />
                    easy-care greens - now at a special spring discount.
                </p>

                <Button
                    variant="light"
                    className="shop-btn"
                    href="/sale"
                >
                    Shop for Sale
                </Button>
            </div>
        </section>
    );
};

export default SaleSection;