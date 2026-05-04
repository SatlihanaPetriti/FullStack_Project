import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/Home/index.jsx';
import IndoorPlants from './components/IndoorPlants/indoor_plants.jsx';
import Header from './components/Header/index.jsx';
import Announcement from './components/Abar/Announcement.jsx';
import AdminRouter from "./Pages/Admin/index.jsx";
import FooterHome from "./components/Footer/index.jsx";
import Productcart from "./components/Products/productcart.jsx";
import { ProductProvider } from "./Context/Product.jsx";
import { CategoryProvider } from './Context/Category.jsx';
import { UserProvider } from './Context/Auth.jsx';
import ProtectedRoute from './Services/ProtectedRoute.jsx';
import ResetPassword from "./components/Login/ResetPassword.jsx";
import { NewsletterProvider } from "./Context/NewsletterContext.jsx";
import CategoryProducts from './components/FeaturedIn/ProductsByCategory.jsx';
import CheckOut from './components/Cart/CheckOut/checkout.jsx';
import FavoritesList from "./components/Favorite/favorite.jsx";
import { FavoritesProvider } from './Context/Favorite.jsx';
import { CartProvider } from './Context/CartContext.jsx';
import { CheckoutProvider } from './Context/Checkout.jsx';
import About from "./components/AboutUs/AboutUs.jsx";
import Contact from "./components/Contact/Contact.jsx";
import AccountPage from './components/Login/logdash.jsx'; // ← ADD

function App() {
  return (
    <UserProvider>
      <CategoryProvider>
        <ProductProvider>
          <CartProvider>
            <CheckoutProvider>
              <NewsletterProvider>
                <FavoritesProvider>
                  <Routes>
                    <Route path="/" element={
                      <>
                        <Announcement />
                        <Header />
                        <HomePage />
                      </>
                    } />

                    <Route path="/indoor-plants" element={
                      <>
                        <Announcement />
                        <Header />
                        <IndoorPlants />
                      </>
                    } />

                    <Route path="/category/:id" element={
                      <>
                        <Announcement />
                        <Header />
                        <CategoryProducts />
                      </>
                    } />

                    <Route path="/admin/*" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminRouter />
                      </ProtectedRoute>
                    } />

                    <Route path="/product/:id" element={
                      <>
                        <Announcement />
                        <Header />
                        <Productcart />
                      </>
                    } />

                    <Route path="/checkout" element={
                      <>
                        <Announcement />
                        <Header />
                        <CheckOut />
                        <FooterHome />
                      </>
                    } />

                    <Route path="/favorite" element={
                      <>
                        <FavoritesList />
                      </>
                    } />

                    <Route path="/About" element={
                      <>
                        <Announcement />
                        <Header />
                        <About />
                        <FooterHome />
                      </>
                    } />

                    <Route path="/Contact" element={
                      <>
                        <Announcement />
                        <Header />
                        <Contact />
                        <FooterHome />
                      </>
                    } />

                    {/* ← ADD THIS ROUTE */}
                    <Route path="/account" element={
                      <>
                        <Announcement />
                        <Header />
                        <AccountPageWrapper />
                        <FooterHome />
                      </>
                    } />

                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Routes>
                </FavoritesProvider>
              </NewsletterProvider>
            </CheckoutProvider>
          </CartProvider>
        </ProductProvider>
      </CategoryProvider>
    </UserProvider>
  );
}

// ← ADD THIS — reads ?tab= from the URL and passes it to AccountPage
import { useSearchParams } from 'react-router-dom';
import { useUserContext } from './Context/Auth.jsx';
import { useNavigate } from 'react-router-dom';

function AccountPageWrapper() {
  const [searchParams] = useSearchParams();
  const { user, logout } = useUserContext();
  const navigate = useNavigate();
  const tab = searchParams.get('tab') || 'profile';

  return (
    <AccountPage
      show={true}
      initialTab={tab}
      user={user}
      onClose={() => navigate(-1)}
      onLogout={() => { logout(); navigate('/'); }}
    />
  );
}

export default App;