import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/Home/index.jsx';
import IndoorPlants from './components/IndoorPlants/indoor_plants.jsx';
import Header from './components/Header/index.jsx';
import Announcement from './components/Abar/Announcement.jsx';
import AdminPageController from "./Pages/Admin/index.jsx"; 

function App() {
    return (
    <>
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

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminPageController />} />
      </Routes>
    </>
  );
}

export default App;