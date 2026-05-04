import { Navbar, Nav, Container } from 'react-bootstrap';
import { Search, Person, Heart, Bag } from 'react-bootstrap-icons';
import logo from '../../assets/images/Home/logo-green.png';
import './menu.css';
import { Link, useNavigate } from 'react-router-dom'; // ← add useNavigate
import Login from '../Login/login';
import { useState, useRef, useEffect } from 'react';
import { useUserContext } from '../../Context/Auth';
import CartDrawer from "../Cart/index";
import { useCartContext } from "../../Context/CartContext";
import FavoritesDropdown from "../Favorite/favorite";
import { useFavorites } from '../../Context/Favorite';
import AccountDropdown from '../Login/Accountmodal';

const Header = () => {
  const { user, logout } = useUserContext();
  const { cart } = useCartContext();
  const { favorites } = useFavorites();
  const navigate = useNavigate(); 

  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [accountPosition, setAccountPosition] = useState({});

  const heartWrapperRef = useRef(null);
  const personIconRef = useRef(null);

  const handleLoginShow = () => setShowLogin(true);
  const handleLoginClose = () => setShowLogin(false);
  const cartCount = cart?.items?.length ?? 0;

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

  const handlePersonClick = () => {
    if (!user) {
      handleLoginShow();
      return;
    }
    if (personIconRef.current) {
      const rect = personIconRef.current.getBoundingClientRect();
      setAccountPosition({
        top: rect.bottom + 8,
        left: rect.left - 100,
      });
    }
    setShowAccount(prev => !prev);
  };

  return (
    <>
      <Navbar expand="lg" className="dropdown-container py-4">
        <Container fluid className="px-5">

          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="logo" height="20" />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-between align-items-center">
            <Nav className="center-menu mx-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/indoor-plants">Shop</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            </Nav>

            <div className="right-icons">
              <div className="icon-box">
                <Search />
              </div>

              <div className="icon-box user-box" ref={personIconRef}>
                <Person
                  size={16}
                  onClick={handlePersonClick}
                  title={user ? "My Account" : "Log In"}
                  style={{ cursor: "pointer" }}
                />
              </div>

              <div className="icon-box" ref={heartWrapperRef} style={{ position: "relative" }}>
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

      {user && (
        <AccountDropdown
          show={showAccount}
          handleClose={() => setShowAccount(false)}
          user={user}
          position={accountPosition}
          logout={logout}
          onNavigate={(tab) => {
            setShowAccount(false);
            navigate(`/account?tab=${tab}`); // ← navigate to route
          }}
        />
      )}
    </>
  );
};

export default Header;