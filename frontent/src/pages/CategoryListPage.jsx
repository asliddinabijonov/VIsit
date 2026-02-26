import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import CardList from "../components/CardList.jsx";
import { getCategoryList, getImagesMap, getRegionBySlug } from "../api";

const titleMap = {
  restaurants: "Restoranlar",
  hotels: "Mehmonxonalar",
  transport: "Transport va Gid Xizmati",
  sights: "Tarixiy va Mashhur Joylar"
};

const descriptionMap = {
  restaurants: "Mazali taomlar va milliy oshxona. Eng yaxshi maskanlar ro'yxati.",
  hotels: "Qulay mehmonxonalar va premium xizmatlar. Siz uchun eng yaxshi tanlovlar.",
  transport: "Transport va gid xizmatlari. Shahar bo'ylab qulay sayohat.",
  sights: "Tarixiy obidalar va mashhur joylar. O'zbekistonning bebaho merosi."
};

export default function CategoryListPage({ category }) {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [region, setRegion] = useState(null);
  const [imagesMap, setImagesMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([getRegionBySlug(slug), getCategoryList(category), getImagesMap()])
      .then(([regionData, listData, map]) => {
        if (!mounted) return;
        setRegion(regionData);
        setImagesMap(map);

        if (regionData) {
          setItems(listData.filter((item) => String(item.viloyat) === String(regionData.id)));
        } else {
          setItems(listData);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug, category]);

  if (loading) return <Loading />;

  return (
    <section className="category">
      <div className="category-header">
        <h1>{titleMap[category]}</h1>
        <p>{descriptionMap[category]}</p>
        {region && <div className="category-region">{region.name}</div>}
      </div>
      {items.length === 0 ? (
        <div className="empty">Hozircha ma'lumot yo'q.</div>
      ) : (
        <CardList items={items} category={category} imagesMap={imagesMap} />
      )}
    </section>
  );
}
