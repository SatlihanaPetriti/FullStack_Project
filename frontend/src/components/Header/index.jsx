import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Search, Person, Heart, Bag, BoxArrowRight } from 'react-bootstrap-icons';
import logo from '../../assets/images/Home/logo-green.png';
import './menu.css';
import { Link } from 'react-router-dom';
import Login from '../Login/login';
import { useState, useRef, useEffect } from 'react';
import { useUserContext } from '../../Context/Auth';
import CartDrawer from "../Cart/index";
import { useCart } from "../../Context/CartContext";
import FavoritesDropdown from "../Favorite/favorite"; 
import { useFavorites } from '../../Context/Favorite';

const Header = () => {
  const { user, logout } = useUserContext();
  const { cartCount } = useCart();
  const { favorites } = useFavorites();

  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const heartWrapperRef = useRef(null);

  const handleLoginShow = () => setShowLogin(true);
  const handleLoginClose = () => setShowLogin(false);

  // Close the favorites dropdown when clicking anywhere outside the heart wrapper
  useEffect(() => {
    if (!showFavorites) return;

    function handleOutsideClick(e) {
      if (heartWrapperRef.current && !heartWrapperRef.current.contains(e.target)) {
        setShowFavorites(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showFavorites]);

  const renderUserIcon = () => {
    if (!user) {
      return (
        <Person size={16} onClick={handleLoginShow} title="Log In" style={{ cursor: "pointer" }} />
      );
    }
    return (
      <NavDropdown title={<Person size={16} />} align="end">
        <NavDropdown.Item onClick={logout}>
          <BoxArrowRight size={14} /> Log Out
        </NavDropdown.Item>
      </NavDropdown>
    );
  };

  return (
    <>
      <Navbar expand="lg" className="dropdown-container py-4">
        <Container fluid className="px-5">

          {/* LOGO */}
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="logo" height="20" />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-between align-items-center">

            {/* CENTER MENU */}
            <Nav className="center-menu mx-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/indoor-plants">Shop</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            </Nav>

            {/* RIGHT ICONS */}
            <div className="right-icons">

              <div className="icon-box">
                <Search />
              </div>

              <div className="icon-box user-box">
                {renderUserIcon()}
              </div>

            
              <div
                className="icon-box"
                ref={heartWrapperRef}
                style={{ position: "relative" }}
              >
                <Heart
                  size={16}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowFavorites(prev => !prev)}
                />

                {favorites.length > 0 && (
                  <span className="bag-count">{favorites.length}</span>
                )}

                {showFavorites && (
                  <FavoritesDropdown onClose={() => setShowFavorites(false)} />
                )}
              </div>

              {/* CART */}
              <div className="icon-box" onClick={() => setShowCart(true)}>
                <Bag />
                {cartCount > 0 && (
                  <span className="bag-count">{cartCount}</span>
                )}
              </div>

              <CartDrawer show={showCart} onClose={() => setShowCart(false)} />

            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {!user && (
        <Login show={showLogin} handleClose={handleLoginClose} />
      )}
    </>
  );
};

export default Header;