import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Person, Heart, Bag, ChevronRight, House,
  Shop, InfoCircle, ChatDots, BoxArrowInRight, PersonPlus,
} from "react-bootstrap-icons";

import logo from "../../assets/images/Home/logo-green.png";
import Login from "../Login/login";
import CartDrawer from "../Cart";
import FavoritesDropdown from "../Favorite/favorite";
import AccountDropdown from "../Login/Accountmodal";

import { useUserContext } from "../../Context/Auth";
import { useCartContext } from "../../Context/CartContext";
import { useFavorites } from "../../Context/Favorite";

import "./menu.css";

const NAV_LINKS = [
  { to: "/", label: "Home", Icon: House },
  { to: "/indoor-plants", label: "Shop", Icon: Shop },
  { to: "/about", label: "About", Icon: InfoCircle },
  { to: "/contact", label: "Contact", Icon: ChatDots },
];

const Header = () => {
  const navigate = useNavigate();

  const { user, logout } = useUserContext();
  const { cart } = useCartContext();
  const { favorites } = useFavorites();

  const [showLogin, setShowLogin] = useState(false);
  const [loginAsSignup, setLoginAsSignup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const heartWrapperRef = useRef(null);
  const personIconRef = useRef(null);

  const cartCount = cart?.items?.length ?? 0;
  const favoritesCount = favorites.length;

  useEffect(() => {
    if (!showFavorites) return;
    const handleOutside = (e) => {
      if (heartWrapperRef.current && !heartWrapperRef.current.contains(e.target)) {
        setShowFavorites(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showFavorites]);

  useEffect(() => { setMenuOpen(false); }, [navigate]);

  const getAccountPosition = () => {
    if (!personIconRef.current) return {};
    const rect = personIconRef.current.getBoundingClientRect();
    return { top: rect.bottom + 8, left: rect.left - 100 };
  };

  const openAuth = (signup = false) => {
    setLoginAsSignup(signup);
    setShowLogin(true);
    setMenuOpen(false);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setLoginAsSignup(false);
  };

  const handlePersonClick = () => {
    if (!user) { openAuth(false); return; }
    setShowAccount((prev) => !prev);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <img src={logo} alt="logo" />
          </Link>

          <nav className="desktop-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
          </nav>

          <div className="header-icons">
            <div className="icon-box user-box desktop-only" ref={personIconRef} onClick={handlePersonClick}>
              <Person size={16} style={{ cursor: "pointer" }} />
            </div>

            <div className="icon-box" ref={heartWrapperRef} style={{ position: "relative" }}>
              <Heart size={16} style={{ cursor: "pointer" }}
                onClick={() => setShowFavorites((prev) => !prev)} />
              {favoritesCount > 0 && <span className="bag-count">{favoritesCount}</span>}
              {showFavorites && <FavoritesDropdown
                onClose={() => setShowFavorites(false)} />}
            </div>

            <div className="icon-box" onClick={() => setShowCart(true)}>
              <Bag size={16} />
              {cartCount > 0 && <span className="bag-count">{cartCount}</span>}
            </div>

            <button
              className={`hamburger mobile-only ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <nav className="mobile-nav">
            {NAV_LINKS.map(({ to, label, Icon }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}>
                <Icon size={16} className="nav-icon" aria-hidden="true" />
                {label}
                <ChevronRight size={13} className="nav-arrow" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            <div className="mobile-menu-footer-label">ACCOUNT</div>

            {user ? (
              <>
                <button className="mm-btn mm-btn--outline" onClick={() => { navigate("/account"); setMenuOpen(false); }}>
                  <Person size={15} aria-hidden="true" /> My Account
                </button>
                <button className="mm-btn mm-btn--solid" onClick={() => { logout(); setMenuOpen(false); }}>
                  <BoxArrowInRight size={15} aria-hidden="true" /> Log Out
                </button>
              </>
            ) : (
              <>
                <button className="mm-btn mm-btn--solid" onClick={() => openAuth(false)}>
                  <BoxArrowInRight size={15} aria-hidden="true" /> Log in
                </button>
                <div className="mm-divider">
                  <div className="mm-divider-line" />
                  <span className="mm-divider-text">Don't have an account?</span>
                  <div className="mm-divider-line" />
                </div>
                <button className="mm-btn mm-btn--outline" onClick={() => openAuth(true)}>
                  <PersonPlus size={15} aria-hidden="true" /> Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <CartDrawer show={showCart} onClose={() => setShowCart(false)} />

      {!user && <Login show={showLogin} handleClose={closeLogin} initialSignup={loginAsSignup} />}

      {user && (
        <AccountDropdown
          show={showAccount}
          handleClose={() => setShowAccount(false)}
          user={user}
          position={getAccountPosition()}
          logout={logout}
          onNavigate={(tab) => { setShowAccount(false); navigate(`/account?tab=${tab}`); }}
        />
      )}
    </>
  );
};

export default Header;