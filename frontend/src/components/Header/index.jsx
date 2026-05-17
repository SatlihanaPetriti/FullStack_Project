import { Person, Heart, Bag, ChevronRight, House, Shop, InfoCircle, ChatDots, BoxArrowInRight, PersonPlus } from 'react-bootstrap-icons';
import logo from '../../assets/images/Home/logo-green.png';
import './menu.css';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../Login/login';
import { useState, useRef, useEffect } from 'react';
import { useUserContext } from '../../Context/Auth';
import CartDrawer from "../Cart/index";
import { useCartContext } from "../../Context/CartContext";
import FavoritesDropdown from "../Favorite/favorite";
import { useFavorites } from '../../Context/Favorite';
import AccountDropdown from '../Login/Accountmodal';

const NAV_LINKS = [
  { to: "/", label: "Home", Icon: House },
  { to: "/indoor-plants", label: "Shop", Icon: Shop },
  { to: "/about", label: "About", Icon: InfoCircle },
  { to: "/contact", label: "Contact", Icon: ChatDots },
];

const Header = () => {
  const { user, logout } = useUserContext();
  const { cart } = useCartContext();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [loginAsSignup, setLoginAsSignup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [accountPosition, setAccountPosition] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const heartWrapperRef = useRef(null);
  const personIconRef = useRef(null);

  const cartCount = cart?.items?.length ?? 0;

  useEffect(() => {
    if (!showFavorites) return;
    const handleOutside = (e) => {
      if (heartWrapperRef.current && !heartWrapperRef.current.contains(e.target))
        setShowFavorites(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showFavorites]);

  useEffect(() => {
    setMenuOpen(false);
  }, [navigate]);

  const handlePersonClick = () => {
    if (!user) { setLoginAsSignup(false); setShowLogin(true); return; }
    if (personIconRef.current) {
      const rect = personIconRef.current.getBoundingClientRect();
      setAccountPosition({ top: rect.bottom + 8, left: rect.left - 100 });
    }
    setShowAccount(prev => !prev);
  };

  const openLogin = () => { setLoginAsSignup(false); setShowLogin(true); setMenuOpen(false); };
  const openSignup = () => { setLoginAsSignup(true); setShowLogin(true); setMenuOpen(false); };
  const closeLogin = () => { setShowLogin(false); setLoginAsSignup(false); };
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">

          {/* LOGO */}
          <Link to="/" className="header-logo">
            <img src={logo} alt="logo" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
          </nav>

          {/* RIGHT ICONS */}
          <div className="header-icons">

            {/* Person-vetem ne desktop */}
            <div
              className="icon-box user-box desktop-only"
              ref={personIconRef}
              onClick={handlePersonClick}
            >
              <Person size={16} style={{ cursor: "pointer" }} />
            </div>

            {/* Favorites */}
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

            {/* Cart */}
            <div className="icon-box" onClick={() => setShowCart(true)}>
              <Bag size={16} />
              {cartCount > 0 && <span className="bag-count">{cartCount}</span>}
            </div>

            {/* Hamburger */}
            <button
              className={`hamburger mobile-only ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>

          <nav className="mobile-nav">
            {NAV_LINKS.map(({ to, label, Icon }) => (
              <Link key={to} to={to} onClick={closeMenu}>
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
                <button className="mm-btn mm-btn--outline" onClick={() => { navigate('/account'); closeMenu(); }}>
                  <Person size={15} aria-hidden="true" />
                  My Account
                </button>
                <button className="mm-btn mm-btn--solid" onClick={() => { logout(); closeMenu(); }}>
                  <BoxArrowInRight size={15} aria-hidden="true" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button className="mm-btn mm-btn--solid" onClick={openLogin}>
                  <BoxArrowInRight size={15} aria-hidden="true" />
                  Log in
                </button>

                <div className="mm-divider">
                  <div className="mm-divider-line" />
                  <span className="mm-divider-text">Don't have an account?</span>
                  <div className="mm-divider-line" />
                </div>

                <button className="mm-btn mm-btn--outline" onClick={openSignup}>
                  <PersonPlus size={15} aria-hidden="true" />
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <CartDrawer show={showCart} onClose={() => setShowCart(false)} />

      {!user && (
        <Login
          show={showLogin}
          handleClose={closeLogin}
          initialSignup={loginAsSignup}
        />
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
            navigate(`/account?tab=${tab}`);
          }}
        />
      )}
    </>
  );
};

export default Header;