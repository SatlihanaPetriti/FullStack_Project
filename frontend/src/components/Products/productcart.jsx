import { useState, useEffect } from "react";
import "./productcart.css";
import { Container, Row, Col, Image, Button, Breadcrumb, Tabs, Tab, ButtonGroup } from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const Productcart = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [activeSize, setActiveSize] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveVariant(data.variants?.[0] ?? null);
      });
  }, [id]);

  const changeQty = (delta) => {
    setQty((q) => Math.max(1, Math.min(10, q + delta)));
  };

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  const uniqueVariants = (product.variants ?? [])
    .filter((v) => v.image)
    .filter((v, i, arr) => arr.findIndex((x) => x.image === v.image) === i);

  // Price logic
  const getPrice = () => {
    if (product.sale_price) return Number(product.sale_price).toFixed(2);
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
      <Breadcrumb className="mb-4 product-breadcrumb">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#">
          {product.category?.name || "Category"}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="gx-0">
        {/* LEFT SIDE — images */}
        <Col md={6} className="d-flex justify-content-center ps-3 py-2">
          <Row>
            <Col xs={2} className="d-flex flex-column gap-4 px-3">
              {uniqueVariants.map((variant) => (
                <Image
                  key={variant.id}
                  src={`${BASE_URL}/${variant.image}`}
                  roundedCircle
                  className={`border product-thumb ${activeVariant?.id === variant.id ? "active-thumb" : ""
                    }`}
                  onClick={() => setActiveVariant(variant)}
                />
              ))}
            </Col>

            {/* Main Image */}
            <Col xs={9}>
              <Image
                src={`${BASE_URL}/${activeVariant?.image}`}
                fluid
                rounded
                className="main-product-image"
              />
            </Col>
          </Row>
        </Col>

        {/* RIGHT SIDE */}
        <Col md={6} className="product-info d-flex flex-column gap-3">
          {/* Title + Wishlist */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0 text-title">{product.title}</h3>
            <span
              className="wishlist-icon"
              onClick={() => setWishlist(!wishlist)}
            >
              {wishlist ? <SuitHeartFill /> : <SuitHeart />}
            </span>
          </div>

          {/* Price */}
          <div className="d-flex align-items-center gap-3 mb-3">
            {hasDiscount && (
              <span className="old-price">€{Number(product.price).toFixed(2)}</span>
            )}
            <h4 className="text-price mb-0">€{getPrice()}</h4>
          </div>

          {product.size && (
            <div className="mb-4">
              <p className="text-size">Size</p>
              <Button
                className=" size-btn single-size"
                disabled
                style={{ cursor: "default" }}
              >
                {product.size}
              </Button>
            </div>
          )}
          {/* STOCK INFORMATION */}
          {/* {activeVariant?.stock === 0 ? (
            <p className="text-danger text-start mb-3">Out of stock</p>
          ) : (
            activeVariant?.stock && (
              <p className="text-stock text-start mb-3">In stock: {activeVariant.stock}</p>
            )
          )} */}

          {/* QUANTITY */}
          <div className="d-flex align-items-center gap-3 mb-4 mt-3">
            <Button className="quantity" onClick={() => changeQty(-1)}>-</Button>
            <span>{qty}</span>
            <Button className="quantity" onClick={() => changeQty(1)}>+</Button>
          </div>

          {/* ADD TO CART */}
          <div className="d-flex gap-4 mb-4">
            <Button
              size="lg"
              className="botton-cart mt-2"
              disabled={!activeVariant || activeVariant.stock === 0}
              onClick={() => {
                const item = {
                  product_id: product.id,
                  variant_id: activeVariant.id,
                  quantity: qty,
                  size: activeSize,
                };
                console.log("ADD TO CART:", item);
              }}
            >
              Add To Cart
            </Button>
          </div>
          <p className="text-note">
            *Please note: this product cannot be cancelled after placing an order
          </p>
        </Col>
      </Row>
      {/* TABS */}
      <Row className="mt-5">
        <Col md={12}>
          <div className="product-tabs">
            <Tabs defaultActiveKey="about" className="product-tabs-nav">
              <Tab eventKey="about" title="About this product">
                <p className="tab-text">
                  {product.description || "No description available."}
                </p>
              </Tab>
              <Tab eventKey="care" title="Care">
                <p className="tab-text">
                  Water once a week and keep soil slightly moist. Keep in indirect sunlight.
                </p>
              </Tab>
              <Tab eventKey="shipment" title="Shipment">
                <p className="tab-text">Delivered within 3–5 business days.</p>
              </Tab>
              <Tab eventKey="guarantee" title="Guarantee">
                <p className="tab-text">Replacement or refund within 48h if damaged.</p>
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Productcart;