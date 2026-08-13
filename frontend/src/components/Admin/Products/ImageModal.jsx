import './Products.css';
const IMAGE_BASE_URL = `${import.meta.env.REACT_APP_BACKEND_URL}/products/uploads/variants`;


const ImageModal = ({ show, onClose, product }) => {
    if (!show) return null;

    const variantsWithImages =
        product?.variants?.filter(
            (variant) => variant.image
        ) ?? [];

    const imageUrl = (image) =>
        `${IMAGE_BASE_URL}/${image}`;

    return (
        <div className="plant-modal-overlay" onClick={onClose}>
            <div
                className="plant-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="plant-modal-header">
                    <h3>{product.title} - Images</h3>
                    <button
                        className="plant-modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="plant-modal-body">
                    {variantsWithImages.length === 0 ? (
                        <p>No images available</p>
                    ) : (
                        <div className="plant-images-grid">
                            {variantsWithImages.map((variant) => (
                                <div key={variant.id} className="plant-image-item">
                                    <div className="plant-image-type">
                                        {variant.type}
                                    </div>
                                    <img
                                        src={imageUrl(variant.image)}
                                        alt={variant.type}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageModal;