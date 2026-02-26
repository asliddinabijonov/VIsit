import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Tabs from "../components/Tabs.jsx";
import DetailHero from "../components/DetailHero.jsx";
import { getDetail, getImagesMap, resolveItemImage } from "../api";

export default function SightDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [imagesMap, setImagesMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getDetail("sights", id), getImagesMap()])
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
  if (!item) return <div className="empty">Tarixiy obida topilmadi.</div>;

  const image = resolveItemImage(
    item,
    imagesMap,
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop"
  );

  const tabs = [
    {
      key: "desc",
      label: "Tavsif",
      content: <p>{item.description || "Tarixiy obida haqida qisqacha ma'lumot."}</p>
    },
    {
      key: "gallery",
      label: "Galleriya",
      content: <p>Rasmlar to'plami yaqin orada qo'shiladi.</p>
    },
    {
      key: "reviews",
      label: "Sharhlar",
      content: <p>Sayyohlarning fikrlari va baholari.</p>
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
        actions={<button className="btn btn-primary">Ekskursiya bron qilish</button>}
      />
      <div className="detail-grid">
        <div className="detail-main">
          <div className="info-card">
            <h3>Amaliy ma'lumotlar</h3>
            <div>Bilet narxi: {item.cost ? `${item.cost} so'm` : "Ma'lumot yo'q"}</div>
            <div>Ish vaqti: 09:00 - 18:00</div>
          </div>
          <Tabs tabs={tabs} />
        </div>
        <aside className="detail-side">
          <div className="info-card">
            <h3>Manzil</h3>
            <div>{item.location || "Kiritilmagan"}</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
