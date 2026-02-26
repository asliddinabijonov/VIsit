import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import DetailHero from "../components/DetailHero.jsx";
import { getDetail, getImagesMap, resolveItemImage } from "../api";

export default function TransportDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [imagesMap, setImagesMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getDetail("transport", id), getImagesMap()])
      .then(([data, map]) => {
        if (mounted) {
          setItem(data);
          setImagesMap(map);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Loading />;
  if (!item) return <div className="empty">Transport xizmati topilmadi.</div>;

  const image = resolveItemImage(
    item,
    imagesMap,
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1200&auto=format&fit=crop"
  );

  return (
    <section className="detail">
      <DetailHero
        title={item.title}
        subtitle={item.description || "Transport va gid xizmati"}
        image={image}
        actions={<button className="btn btn-primary">Buyurtma berish</button>}
      />
      <div className="detail-grid">
        <div className="detail-main">
          <div className="info-card">
            <h3>Avtomobil turlari</h3>
            <ul className="list">
              <li>Sedan - 25$ / soat</li>
              <li>Minivan - 40$ / soat</li>
              <li>Premium - 60$ / soat</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>Xizmatlar</h3>
            <ul className="list">
              <li>Aeroport transfer</li>
              <li>Shahar bo'ylab sayohat</li>
              <li>Viloyatlararo safar</li>
            </ul>
          </div>
          <div className="map-card">
            <img
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop"
              alt="Xarita"
            />
          </div>
        </div>
        <aside className="detail-side">
          <div className="info-card">
            <h3>Kontakt</h3>
            <div>Telefon: {item.phone_number || "Kiritilmagan"}</div>
            <div>Email: {item.email || "Kiritilmagan"}</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
