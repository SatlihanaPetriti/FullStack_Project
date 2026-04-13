import { useState, useEffect } from "react";
import "./productcart.css";
import { Container, Row, Col, Image, Button, Breadcrumb, Tabs, Tab } from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { useParams, Link } from "react-router-dom";
import { useProductContext } from "../../Context/Product";
import { useCart } from "../../Context/CartContext";
import { useFavorites } from "../../Context/Favorite";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const Productcart = () => {
  const { id } = useParams();
  const { getProductById } = useProductContext();
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, favorites } = useFavorites();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getProductById(id);
      setProduct(data);
      setSelectedImage(data?.variants?.find((v) => v.image)?.image || null);
    };
    load();
  }, [id]);

  const isFavorite = product
    ? favorites.some((fav) => fav.product_id === product.id)
    : false;

  const handleToggleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product.id);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setFavLoading(false);
    }
  };

  const changeQty = (delta) => {
    const newQty = qty + delta;
    if (newQty < 1) return;
    setQty(newQty);
  };

  const getPrice = () => {
    if (product.sale_price) return Number(product.sale_price);
    if (product.sale_percentage)
      return product.price - (product.price * product.sale_percentage) / 100;
    return Number(product.price);
  };

  const handleAddToCart = () => {
    const finalPrice = getPrice();
    addToCart({
      product_id: product.id,
      title: product.title,
      price: finalPrice.toFixed(2),
      image: product.variants?.find((v) => v.image)?.image,
      quantity: qty,
    });
  };

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  const finalPrice = getPrice();
  const hasDiscount = finalPrice < Number(product.price);

  return (
    <Container fluid className="product-cart-container">

      <Breadcrumb className="mb-4 product-breadcrumb">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/category/${product.category?.id}` }}>
          {product.category?.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="gx-0">
        <Col md={6} className="d-flex justify-content-center ps-3 py-2">
          <Row>
            <Col xs={2} className="d-flex flex-column gap-4 px-3">
              {product.variants?.map((variant) => (
                <Image
                  key={variant.id}
                  src={`${BASE_URL}/${variant.image}`}
                  roundedCircle
                  className="border product-thumb"
                  onClick={() => setSelectedImage(variant.image)}
                />
              ))}
            </Col>
            <Col xs={9}>
              <Image
                src={`${BASE_URL}/${selectedImage}`}
                fluid
                rounded
                className="main-product-image"
              />
            </Col>
          </Row>
        </Col>

        <Col md={6} className="product-info d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0 text-title">{product.title}</h3>
            <span
              className="wishlist-icon"
              onClick={handleToggleFavorite}
              style={{
                cursor: favLoading ? "wait" : "pointer",
                opacity: favLoading ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {isFavorite ? <SuitHeartFill color="red" /> : <SuitHeart />}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            {hasDiscount && (
              <span className="old-price">€{Number(product.price).toFixed(2)}</span>
            )}
            <h4 className="text-price">€{finalPrice.toFixed(2)}</h4>
          </div>

          {product.size && (
            <div className="mb-4">
              <p className="text-size">Size</p>
              <Button className="size-btn single-size" disabled>{product.size}</Button>
            </div>
          )}

          <div className="d-flex align-items-center gap-3 mb-4 mt-3">
            <Button className="quantity" onClick={() => changeQty(-1)}>-</Button>
            <span>{qty}</span>
            <Button className="quantity" onClick={() => changeQty(1)}>+</Button>
          </div>

          <Button
            size="lg"
            className="botton-cart mt-2"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>

          <p className="text-note">
            *Please note: this product cannot be cancelled after placing an order
          </p>
        </Col>
      </Row>

      <Row className="product-tabs mt-5">
        <Col md={12}>
          <Tabs defaultActiveKey="about" className="product-tabs-nav">
            <Tab className="tab-text" eventKey="about" title="Description">
              {product.description || "No description available."}
            </Tab>
            <Tab className="tab-text" eventKey="care" title="Care">Water once a week.</Tab>
            <Tab className="tab-text" eventKey="shipment" title="Shipment">3–5 days delivery.</Tab>
            <Tab className="tab-text" eventKey="guarantee" title="Guarantee">Refund if damaged.</Tab>
          </Tabs>
        </Col>
      </Row>

    </Container>
  );
};

export default Productcart;