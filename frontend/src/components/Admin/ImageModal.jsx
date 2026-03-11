import './ImageModal.css';

const IMAGE_BASE_URL = "http://localhost:3000/products/uploads";

const ImageModal = ({ show, onClose, product }) => {
    if (!show) return null;

    const getImageUrl = (image) => {
        return image ? `${IMAGE_BASE_URL}/${image}` : null;
    };

    let variantsWithImages = [];
    if (product && product.variants) {
        variantsWithImages = product.variants.filter(v => v.image);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{product.title} - Images</h3>
                    <button className="close-btn" onClick={onClose}>X</button>
                </div>

                <div className="modal-body">
                    {variantsWithImages.length === 0 ? (
                        <p>No images available</p>
                    ) : (
                            <div className="images-grid">
                                {variantsWithImages.map((variant) => (
                                    <div key={variant.id} className="image-item">
                                        <div className="image-type">{variant.type}</div>
                                        <img
                                            src={getImageUrl(variant.image)}
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