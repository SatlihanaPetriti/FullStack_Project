import { useState, useEffect } from "react";
import "./productcart.css";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Breadcrumb,
  Tabs,
  Tab,
} from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { useProductContext } from "../../Context/Product";

const BASE_URL = "http://localhost:3000/products/uploads/variants";

const Productcart = () => {
  const { id } = useParams();

  const { getProductById } = useProductContext();

  const [product, setProduct] = useState([]);
  const [activeVariant, setActiveVariant] = useState([]);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getProductById(id);
      setProduct(data);
      setActiveVariant(data?.variants?.[0] || null);
    };
    load();
  }, [id]);

  const maxQTY = activeVariant.stock;
  const changeQty = (delta) => {
    setQty((q) => Math.max(1, Math.min(maxQTY, q + delta)));
  };
  useEffect(() => {
    setQty(1);
  }, [activeVariant]);
  
  const getPrice = () => {
    if (product.sale_price)
      return Number(product.sale_price).toFixed(2);

    if (product.sale_percentage) {
      return (
        product.price - (product.price * product.sale_percentage) / 100).toFixed(2);
    }
    return Number(product.price).toFixed(2);
  };
  const hasDiscount = !!product.sale_price || !!product.sale_percentage;
  const stock = activeVariant?.stock ?? 0;

  return (
    <Container fluid className="product-cart-container">
      <Breadcrumb className="mb-4 product-breadcrumb">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          {product.category?.name || "Category"}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {product.title}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row className="gx-0">

        {/* LEFT SIDE */}
        <Col md={6} className="d-flex justify-content-center ps-3 py-2">
          <Row>

            {/* THUMBS */}
            <Col xs={2} className="d-flex flex-column gap-4 px-3">
              {product.variants?.map((variant) => (
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

            {/* MAIN IMAGE */}
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

          {/* TITLE + WISHLIST */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0 text-title">{product.title}</h3>

            <span onClick={() => setWishlist(!wishlist)}>
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
            disabled={stock <= 0}            
          >
            Add To Cart
          </Button>

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
                  Water once a week and keep soil slightly moist.
                </p>
              </Tab>

              <Tab eventKey="shipment" title="Shipment">
                <p className="tab-text">Delivered within 3–5 business days.</p>
              </Tab>

              <Tab eventKey="guarantee" title="Guarantee">
                <p className="tab-text">Refund within 48h if damaged.</p>
              </Tab>

            </Tabs>
          </div>
        </Col>
      </Row>

    </Container>
  );
};

export default Productcart;