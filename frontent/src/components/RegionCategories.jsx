import { Link } from "react-router-dom";

export default function RegionCategories({ slug }) {
  return (
    <div className="region-categories">
      <Link to={`/region/${slug}/sights`} className="category-btn category-top-right">
        <span className="category-icon">T</span>
        Tarixiy va Mashhur Joylar
      </Link>
      <Link to={`/region/${slug}/transport-guides`} className="category-btn category-bottom-right">
        <span className="category-icon">G</span>
        Transport va Gid Xizmati
      </Link>
      <Link to={`/region/${slug}/restaurants`} className="category-btn category-top-left">
        <span className="category-icon">R</span>
        Restoran va Kafelar
      </Link>
      <Link to={`/region/${slug}/hotels`} className="category-btn category-bottom-left">
        <span className="category-icon">M</span>
        Mehmonxonalar
      </Link>
    </div>
  );
}
