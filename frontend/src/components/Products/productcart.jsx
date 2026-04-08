import { useState } from "react";
import "./productcart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Image, Button, ButtonGroup, Breadcrumb, Tabs, Tab } from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";

import plant1 from "../../assets/images/IndoorPlants/bamboo_palm/charcoal_bamboo.jpg";
import plant2 from "../../assets/images/IndoorPlants/bamboo_palm/clay_bamboo.jpg";
import plant3 from "../../assets/images/IndoorPlants/bamboo_palm/indigo_bamboo.jpg";
import plant4 from "../../assets/images/IndoorPlants/bamboo_palm/slate_bamboo.jpg";
import plant5 from "../../assets/images/IndoorPlants/bamboo_palm/stone_bamboo.jpg";

/* Images */
const thumbnails = [plant1, plant2, plant3, plant4, plant5];

/* Pot Colors */
const COLORS = [
  { label: "Charcoal", hex: "#3a3530" },
  { label: "Clay", hex: "#b5694d" },
  { label: "Indigo", hex: "#3b4a6b" },
  { label: "Slate", hex: "#6b7c8c" },
  { label: "Stone", hex: "#a8a090" },
];

/* Sizes */
const SIZES = ["XS", "S", "M", "L", "XL"];
const OUT_OF_STOCK = ["XS"];

const product = {
  name: "Monstera Plant",
  price: "$29.99",
  description:
    "A beautiful indoor plant that brings freshness and style to your home.",
};

const Productcart = () => {
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const changeQty = (delta) =>
    setQty((q) => Math.max(1, Math.min(10, q + delta)));

  return (
    <Container fluid className="product-cart-container">

      <Breadcrumb className="mb-4 product-breadcrumb">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/indoor-plants">Indoor Plants</Breadcrumb.Item>
        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="gx-0">
        <Col md={6} className="d-flex">
          <Row>
            {/* Thumbnails */}
            <Col xs={2} className="d-flex flex-column gap-4 px-5">
              {thumbnails.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  roundedCircle
                  className={`border product-thumb ${
                    activeImg === index ? "active-thumb" : ""
                  }`}
                  onClick={() => setActiveImg(index)}
                />
              ))}
            </Col>

            {/* Main Image */}
            <Col xs={9}>
              <Image
                src={thumbnails[activeImg]}
                fluid
                rounded
                className="main-product-image"
              />
            </Col>
          </Row>
        </Col>

        {/* RIGHT SIDE: Product Info */}
        <Col md={6} className="product-info">

          {/* Title + Heart */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0 text-title">{product.name}</h3>
            <span
              className="wishlist-icon"
              onClick={() => setWishlist(!wishlist)}
            >
              {wishlist ? <SuitHeartFill/> : <SuitHeart/>}
            </span>
          </div>

          {/* Price + Description */}
          <h4 className="text-price">{product.price}</h4>
          <p className="text-desc">{product.description}</p>

          {/* Scrollable Options */}
          <div className="product-scroll">

            {/* COLORS */}
            <div className="mb-4">
              <p className="text-pot">Pot Color</p>
              <div className="d-flex gap-4">
                {COLORS.map((color, index) => (
                  <div
                    key={index}
                    className="color-option text-center"
                    onClick={() => {
                      setActiveColor(index);
                      setActiveImg(index);
                    }}
                  >
                    <div
                      className={`color-circle ${activeColor === index ? "active-color" : ""}`}
                      style={{ background: color.hex }}
                    />
                    <span className="color-label">{color.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SIZES */}
            <div className="mb-4">
              <p className="text-size">Size</p>
              <ButtonGroup>
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    className={`size-btn ${activeSize === size ? "active" : ""}`}
                    disabled={OUT_OF_STOCK.includes(size)}
                    onClick={() => setActiveSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            {/* QUANTITY */}
            <div className="d-flex align-items-center gap-3 mb-4 mt-3">
              <Button className="quantity" onClick={() => changeQty(-1)}>-</Button>
              <span>{qty}</span>
              <Button className="quantity" onClick={() => changeQty(1)}>+</Button>
            </div>

            {/* ACTION BUTTON */}
            <div className="d-flex gap-4 mb-4">
              <Button size="lg" className="botton-cart mt-2">
                Add To Cart
              </Button>
            </div>
              <p className="text-note"> *Please note: this product cannot be cancelled after placing an order</p>
          </div>
        </Col>
      </Row>

      {/* PRODUCT INFO TABS (Full Width) */}
      <Row className="mt-5">
        <Col md={12}>
          <div className="product-tabs">
            <Tabs defaultActiveKey="about" className="product-tabs-nav">
              <Tab eventKey="about" title="About this product">
                <p className="tab-text">
                  This Monstera plant is perfect for indoor spaces. Its large green leaves
                  add a tropical feeling to your home while helping purify the air.
                  Ideal for living rooms, offices, and bright corners.
                </p>
              </Tab>
              <Tab eventKey="care" title="Care">
                <p className="tab-text">
                  Water once a week and keep the soil slightly moist. Place the plant in
                  bright indirect sunlight. Avoid direct harsh sun and cold drafts.
                </p>
              </Tab>
              <Tab eventKey="shipment" title="Shipment">
                <p className="tab-text">
                  Orders are processed within 24–48 hours. Plants are carefully packaged
                  to ensure safe delivery and usually arrive within 3–5 business days.
                </p>
              </Tab>
              <Tab eventKey="guarantee" title="Guarantee">
                <p className="tab-text">
                  If your plant arrives damaged, contact us within 48 hours and we will
                  replace it free of charge or issue a refund.
                </p>
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>

    </Container>
  );
};

export default Productcart;