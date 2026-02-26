import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Tabs from "../components/Tabs.jsx";
import DetailHero from "../components/DetailHero.jsx";
import { getDetail, getImagesMap, resolveItemImage } from "../api";

export default function HotelDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [imagesMap, setImagesMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getDetail("hotels", id), getImagesMap()])
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
  if (!item) return <div className="empty">Mehmonxona topilmadi.</div>;

  const image = resolveItemImage(
    item,
    imagesMap,
    "https://images.unsplash.com/photo-1501117716987-c8e1ecb2100f?q=80&w=1200&auto=format&fit=crop"
  );

  const tabs = [
    {
      key: "desc",
      label: "Tavsif",
      content: <p>{item.description || "Qulay va zamonaviy mehmonxona."}</p>
    },
    {
      key: "rooms",
      label: "Xonalar",
      content: (
        <ul className="list">
          <li>Standard - 2 kishi</li>
          <li>Deluxe - 3 kishi</li>
          <li>Suite - 4 kishi</li>
        </ul>
      )
    },
    {
      key: "reviews",
      label: "Sharhlar",
      content: <p>Mehmonlarimizning ijobiy fikrlari bilan tanishing.</p>
    },
    {
      key: "amenities",
      label: "Qulayliklar",
      content: <p>Wi-Fi, nonushta, fitness, basseyn.</p>
    },
    {
      key: "location",
      label: "Manzil",
      content: <p>{item.location || "Manzil kiritilmagan"}</p>
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
          <Tabs tabs={tabs} />
        </div>
        <aside className="detail-side">
          <div className="info-card">
            <h3>Bron qilish</h3>
            <label>
              Kirish sanasi
              <input type="date" />
            </label>
            <label>
              Chiqish sanasi
              <input type="date" />
            </label>
            <label>
              Mehmonlar soni
              <input type="number" min="1" defaultValue="2" />
            </label>
            <button className="btn btn-secondary">Bron qilish</button>
          </div>
        </aside>
      </div>
    </section>
  );
}
