import { Link } from "react-router-dom";
import { resolveItemImage } from "../api";

export default function CardItem({ item, category, imagesMap }) {
  const image = resolveItemImage(
    item,
    imagesMap,
    "https://images.unsplash.com/photo-1440778303588-435521a205bc?q=80&w=1200&auto=format&fit=crop"
  );

  const name = item.title || item.name || "Noma'lum";
  const address = item.location || item.address || "Manzil kiritilmagan";
  const opening = item.opening_hours || item.openingHours || "10:00 - 22:00";
  const rating = item.rating ? `Reyting: ${item.rating}` : "";
  const price = item.price_per_night ? `$${item.price_per_night} / kecha` : "";

  return (
    <article className="card">
      <img src={image} alt={name} className="card-image" />
      <div className="card-body">
        <h3>{name}</h3>
        <div className="card-meta">
          {rating && <span>{rating}</span>}
          {price && <span>{price}</span>}
        </div>
        <p className="card-desc">{item.description || item.shortDescription}</p>
        <div className="card-info">Manzil: {address}</div>
        <div className="card-info">Ish vaqti: {opening}</div>
        <div className="card-footer">
          <Link className="btn btn-secondary" to={`/${category}/${item.id}`}>
            Batafsil
          </Link>
        </div>
      </div>
    </article>
  );
}
