import { useState, useEffect } from "react";
import { Container, Row, Col, Image, Button, Breadcrumb, Tabs, Tab } from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { useParams, Link } from "react-router-dom";
import { useProductContext } from "../../Context/Product";
import { useCartContext } from "../../Context/CartContext";
import { useFavorites } from "../../Context/Favorite";
import "./productcart.css";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const getPrice = (product) => {
  if (product.sale_percentage)
    return product.price - (product.price * product.sale_percentage) / 100;
  return Number(product.price);
};

const Productcart = () => {
  const { id } = useParams();
  const { getProductById } = useProductContext();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCartContext();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    getProductById(id).then(data => {
      setProduct(data);
      setSelectedImage(data?.variants?.find(v => v.image)?.image || null);
    });
  }, [id]);

  useEffect(() => {
    if (!product || !cart?.items) return;
    const item = cart.items.find(i => i.product_id === product.id);
    setQty(item ? item.quantity : 1);
  }, [product, cart]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  const cartItem = cart?.items?.find(i => i.product_id === product.id) ?? null;
  const isFavorite = favorites.some(f => f.product_id === product.id);
  const finalPrice = getPrice(product);

  const handleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      isFavorite ? await removeFavorite(product.id) : await addFavorite(product.id);
    } finally {
      setFavLoading(false);
    }
  };

  const handleChangeQty = async (delta) => {
    const newQty = qty + delta;
    if (newQty < 1) {
      if (cartItem) await removeFromCart(cartItem.id);
      setQty(1);
      return;
    }
    if (newQty > product.stock) return;
    setQty(newQty);
    if (cartItem) await updateQuantity(cartItem.id, newQty);
  };

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

        {/* IMAGES */}
        <Col md={6} className="d-flex justify-content-center ps-3 py-2">
          <Row>
            <Col xs={2} className="d-flex flex-column gap-4 px-3">
              {product.variants?.map(v => (
                <Image
                  key={v.id}
                  src={`${BASE_URL}/${v.image}`}
                  roundedCircle
                  className="border product-thumb"
                  onClick={() => setSelectedImage(v.image)}
                />
              ))}
            </Col>
            <Col xs={9}>
              <Image
                src={`${BASE_URL}/${selectedImage}`}
                fluid rounded
                className="main-product-image"
              />
            </Col>
          </Row>
        </Col>

        {/* INFO */}
        <Col md={6} className="product-info d-flex flex-column gap-3">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0 text-title">{product.title}</h3>
            <span
              className="wishlist-icon"
              onClick={handleFavorite}
              style={{ cursor: favLoading ? "wait" : "pointer", opacity: favLoading ? 0.6 : 1 }}
            >
              {isFavorite ? <SuitHeartFill color="red" /> : <SuitHeart />}
            </span>
          </div>

          <h4 className="text-price mb-3">€{finalPrice.toFixed(2)}</h4>

          {product.size && (
            <div className="mb-4">
              <p className="text-size">Size</p>
              <Button className="size-btn single-size" disabled>{product.size}</Button>
            </div>
          )}

          <div className="d-flex align-items-center gap-3 mb-4 mt-3">
            <Button className="quantity" onClick={() => handleChangeQty(-1)}>-</Button>
            <span>{qty}</span>
            <Button className="quantity" onClick={() => handleChangeQty(1)}>+</Button>
          </div>

          {cartItem ? (
            <Button size="lg" variant="danger" className="botton-cart mt-2" onClick={() => removeFromCart(cartItem.id)}>
              Remove from Cart
            </Button>
          ) : (
            <Button size="lg" className="botton-cart mt-2" disabled={product.stock <= 0} onClick={() => addToCart(product.id, qty)}>
              Add To Cart
            </Button>
          )}

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