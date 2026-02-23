// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from './Pages/Home/index.jsx';
import IndoorPlants from './components/IndoorPlants/indoor_plants.jsx';
import Header from './components/Header/index.jsx';
import Announcement from './components/Abar/Announcement.jsx';
import HomeAdmin from './components/Admin/AdminProductsPage.jsx';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && (
        <>
          <Announcement />
          <Header />
        </>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/indoor-plants" element={<IndoorPlants />} />
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/admin/products" element={<HomeAdmin />} />
      </Routes>
    </>
  );
}

export default App;