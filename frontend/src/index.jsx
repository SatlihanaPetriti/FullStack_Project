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
import UserLayout from "./components/Login/UserDashboard/UserLayout.jsx";
import SalePage from './components/salesection/SalePage.jsx';
import DashboardFavorites from "./components/Login/UserDashboard/Favorite.jsx";
import MyProfile from "./components/Login/UserDashboard/MyProfile.jsx";
import { OrderProvider } from "./Context/OrderService.jsx";
import UserOrders from "./components/Login/UserDashboard/MyOrders.jsx";
import AccountDashboard from "./components/Login/UserDashboard/dashboard.jsx";
import { ContactProvider } from "./Context/ContactContext.jsx";
function App() {
  return (
    <UserProvider>
      <CategoryProvider>
        <ProductProvider>
          <CartProvider>
            <CheckoutProvider>
              <OrderProvider>
                <NewsletterProvider>
                  <FavoritesProvider>
                    <ContactProvider>
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
                        <Route path="/sale" element={
                          <><Announcement />
                            <Header />
                            <SalePage />
                          </>}
                        />

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
                        <Route path="/account" element={
                          <>
                            <Announcement />
                            <Header />
                            <UserLayout />
                            <FooterHome />
                          </>
                        }>
                          <Route path="profile" element={<MyProfile />} />
                          <Route index element={<AccountDashboard />} />
                        </Route>
                        <Route path="/reset-password" element={<ResetPassword />} />
                      </Routes>
                    </ContactProvider>
                  </FavoritesProvider>
                </NewsletterProvider>
              </OrderProvider>
            </CheckoutProvider>
          </CartProvider>
        </ProductProvider>
      </CategoryProvider>
    </UserProvider >
  );
}

export default App;