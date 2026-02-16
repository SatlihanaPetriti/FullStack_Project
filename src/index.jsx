// src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/Home/index.jsx';
import IndoorPlants from './components/IndoorPlants/indoor_plants.jsx';
import Header from './components/Header/index.jsx';
import Announcement from './components/Abar/Announcement.jsx';

function App() {
  return (
    <>
      <Announcement />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/indoor-plants" element={<IndoorPlants />} />
      </Routes>
    </>
  );
}

export default App;
