import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import RegionPage from "./pages/RegionPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import RegionServicesPage from "./pages/RegionServicesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/region/:slug" element={<RegionPage />} />
      <Route path="/region/:slug/services/:type" element={<RegionServicesPage />} />
      <Route path="/region/:slug/services/:type/:itemKey" element={<ServiceDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
