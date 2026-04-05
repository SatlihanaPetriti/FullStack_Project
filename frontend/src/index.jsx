import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/Home/index.jsx';
import IndoorPlants from './components/IndoorPlants/indoor_plants.jsx';
import Header from './components/Header/index.jsx';
import Announcement from './components/Abar/Announcement.jsx';
import AdminRouter from "./Pages/Admin/index.jsx";
import Productcart from "./components/Products/productcart.jsx";
import { ProductProvider } from './Context/Product';
import { CategoryProvider } from './Context/Category.jsx';
import { UserProvider } from './Context/Auth.jsx';
import ProtectedRoute from './Services/ProtectedRoute.jsx';
import ResetPassword from "./components/Login/ResetPassword.jsx";

function App() {
  return (
    <UserProvider>
      <CategoryProvider>
        <ProductProvider>
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


            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminRouter />
              </ProtectedRoute>
            } />

            <Route path="/productcart" element={
              <>
                <Announcement />
                <Header />
                <Productcart />
              </>
            } />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </ProductProvider>
      </CategoryProvider>
    </UserProvider>
  );
}

export default App;