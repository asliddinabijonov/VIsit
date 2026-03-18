import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DestinationsPage from "./pages/DestinationsPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import RegionPage from "./pages/RegionPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import RegionServicesPage from "./pages/RegionServicesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/destinations" element={<DestinationsPage />} />
      <Route path="/experiences" element={<ExperiencesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/region/:slug" element={<RegionPage />} />
      <Route path="/region/:slug/services/:type" element={<RegionServicesPage />} />
      <Route path="/region/:slug/services/:type/:itemKey" element={<ServiceDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
