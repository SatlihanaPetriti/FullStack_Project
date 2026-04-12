import { useState, useEffect } from "react";
import "./productcart.css";
import { Container, Row, Col, Image, Button, Breadcrumb, Tabs, Tab } from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { useParams, Link } from "react-router-dom";
import { useProductContext } from "../../Context/Product";
import { check_stock_service } from "../../Services/Product";
import { useCart } from "../../Context/CartContext";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const Productcart = () => {
  const { id } = useParams();
  const { getProductById } = useProductContext();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getProductById(id);
      setProduct(data);
      setSelectedImage(data?.variants?.find(v => v.image)?.image || null);
    };
    load();
  }, [id]);

  if (!product) {
    return <p className="text-center mt-5">Loading...</p>;
  }


  const handleAddToCart = () => {
    const item = {
      product_id: product.id,
      title: product.title,
      price: getPrice(),
      image: product.variants?.find(v => v.image)?.image,
      quantity: qty
    };
    addToCart(item);
    console.log("add to cart", item);
  };


  const handleCheckStock = async (quantity) => {
    try {
      await check_stock_service(product.id, quantity);
      return true;
    } catch (err) {
      console.log(err.response?.data?.message || "Stock error");
      return false;
    }
  };

  const changeQty = async (delta) => {
    const newQty = qty + delta;
    if (newQty < 1) return;
    const ok = await handleCheckStock(newQty);
    if (!ok) return;
    setQty(newQty);
  };

  const getPrice = () => {
    if (product.sale_price)
      return Number(product.sale_price).toFixed(2);
    if (product.sale_percentage) {
      return (
        product.price -
        (product.price * product.sale_percentage) / 100
      ).toFixed(2);
    }
    return Number(product.price).toFixed(2);
  };

  const hasDiscount = !!product.sale_price || !!product.sale_percentage;

  return (
    <Container fluid className="product-cart-container">

      {/* BREADCRUMB */}
      <Breadcrumb className="mb-4 product-breadcrumb">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `/category/${product.category?.id}` }}
        >
          {product.category?.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {product.title}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row className="gx-0">

        {/* LEFT SIDE */}
        <Col md={6} className="d-flex justify-content-center ps-3 py-2">
          <Row>

            {/* THUMBNAILS */}
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

            {/* MAIN IMAGE */}
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

        {/* RIGHT SIDE */}
        <Col md={6} className="product-info d-flex flex-column gap-3">

          {/* TITLE + WISHLIST */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0 text-title">{product.title}</h3>

            <span
              className="wishlist-icon"
              onClick={() => setWishlist(!wishlist)}
            >
              {wishlist ? <SuitHeartFill /> : <SuitHeart />}
            </span>
          </div>

          {/* PRICE */}
          <div className="d-flex align-items-center gap-3 mb-3">
            {hasDiscount && (
              <span className="old-price">
                €{Number(product.price).toFixed(2)}
              </span>
            )}
            <h4 className="text-price">€{getPrice()}</h4>
          </div>

          {/* SIZE */}
          {product.size && (
            <div className="mb-4">
              <p className="text-size">Size</p>
              <Button className="size-btn single-size" disabled>
                {product.size}
              </Button>
            </div>
          )}

          {/* STOCK (OPTIONAL DISPLAY) */}
          {/* <p className="text-muted">
            Stock available: {stock}
          </p> */}

          {/* QUANTITY */}
          <div className="d-flex align-items-center gap-3 mb-4 mt-3">
            <Button className="quantity" onClick={() => changeQty(-1)}>
              -
            </Button>

            <span>{qty}</span>

            <Button className="quantity" onClick={() => changeQty(1)}>
              +
            </Button>
          </div>

          {/* ADD TO CART */}
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

      {/* TABS */}
      <Row className="product-tabs mt-5">
        <Col md={12}>
          <Tabs defaultActiveKey="about" className="product-tabs-nav">

            <Tab className= "tab-text" eventKey="about" title="Description">
              {product.description || "No description available."}
            </Tab>

            <Tab className="tab-text"  eventKey="care" title="Care">
              Water once a week.
            </Tab>

            <Tab className="tab-text"  eventKey="shipment" title="Shipment">
              3–5 days delivery.
            </Tab>

            <Tab className="tab-text"  eventKey="guarantee" title="Guarantee">
              Refund if damaged.
            </Tab>

          </Tabs>
        </Col>
      </Row>

    </Container>
  );
};

export default Productcart;