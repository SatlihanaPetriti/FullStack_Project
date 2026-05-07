import { useProductContext } from '../../Context/Product';
import PlantCard from '../IndoorPlants/plantcard';
import './SalePage.css';

const SalePage = () => {
    const { products, loading, error } = useProductContext();

    const saleProducts = products.filter(
        (p) => p.sale_price || p.sale_percentage
    );

    if (loading) return <div className="sale-spinner" />;
    if (error) return <p> {error}</p>;

    return (
        <div className="sale-page">
            <div className="sale-hero">
                <h1 className="sale-hero__title">
                    Spring <em>Sale</em>
                </h1>
                <p className="sale-hero__sub">
                    Fresh greens, unbeatable prices — up to 25% off indoor plants
                </p>
            </div>

            <div className="sale-body container">
                <div className="sale-grid">
                    {saleProducts.map((product) => (
                        <PlantCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalePage;