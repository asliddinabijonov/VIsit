import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Tabs from "../components/Tabs.jsx";
import DetailHero from "../components/DetailHero.jsx";
import { getDetail, getImagesMap, resolveItemImage } from "../api";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [imagesMap, setImagesMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getDetail("restaurants", id), getImagesMap()])
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
  if (!item) return <div className="empty">Restoran topilmadi.</div>;

  const image = resolveItemImage(
    item,
    imagesMap,
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop"
  );

  const tabs = [
    {
      key: "desc",
      label: "Tavsif",
      content: <p>{item.description || "Mazali taomlar va iliq muhit."}</p>
    },
    {
      key: "menu",
      label: "Menyu",
      content: (
        <ul className="list">
          <li>Osh va shashlik</li>
          <li>Somsa va manti</li>
          <li>Shirinliklar va choy</li>
        </ul>
      )
    },
    {
      key: "reviews",
      label: "Sharhlar",
      content: <p>Mehmonlarimizdan yuqori baholar va ijobiy fikrlar.</p>
    }
  ];

  return (
    <section className="detail">
      <DetailHero
        title={item.title}
        subtitle={item.location}
        image={image}
        actions={<button className="btn btn-primary">Bron qilish</button>}
      />
      <div className="detail-grid">
        <div className="detail-main">
          <div className="map-card">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
              alt="Xarita"
            />
          </div>
          <Tabs tabs={tabs} />
        </div>
        <aside className="detail-side">
          <div className="info-card">
            <h3>Kontakt ma'lumotlari</h3>
            <div>Manzil: {item.location || "Kiritilmagan"}</div>
            <div>Telefon: {item.phone_number || "Kiritilmagan"}</div>
            <div>Ish vaqti: {item.opening_hours || "11:00 - 23:00"}</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
