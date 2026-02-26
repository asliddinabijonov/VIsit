import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegionPage from "./pages/RegionPage.jsx";
import CategoryListPage from "./pages/CategoryListPage.jsx";
import RestaurantDetailPage from "./pages/RestaurantDetailPage.jsx";
import HotelDetailPage from "./pages/HotelDetailPage.jsx";
import TransportDetailPage from "./pages/TransportDetailPage.jsx";
import SightDetailPage from "./pages/SightDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/region/:slug" element={<RegionPage />} />
        <Route path="/region/:slug/restaurants" element={<CategoryListPage category="restaurants" />} />
        <Route path="/region/:slug/hotels" element={<CategoryListPage category="hotels" />} />
        <Route path="/region/:slug/transport-guides" element={<CategoryListPage category="transport" />} />
        <Route path="/region/:slug/sights" element={<CategoryListPage category="sights" />} />
        <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
        <Route path="/transport/:id" element={<TransportDetailPage />} />
        <Route path="/sights/:id" element={<SightDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
