import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/Home/index.jsx';
import IndoorPlants from './components/IndoorPlants/indoor_plants.jsx';
import Header from './components/Header/index.jsx';
import Announcement from './components/Abar/Announcement.jsx';
import AdminRouter from "./Pages/Admin/index.jsx";
import { ProductProvider } from './Context/Product';

function App() {
  return (
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

        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </ProductProvider>
  );
}

export default App;