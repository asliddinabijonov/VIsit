import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RegionCategories from "../components/RegionCategories.jsx";
import Loading from "../components/Loading.jsx";
import { getRegionBySlug } from "../api";
import { resolveMediaUrl } from "../utils";

export default function RegionPage() {
  const { slug } = useParams();
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getRegionBySlug(slug)
      .then((data) => {
        if (mounted) setRegion(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <Loading />;
  if (!region) return <div className="empty">Viloyat topilmadi.</div>;

  const image = region.image ? resolveMediaUrl(region.image) : "/assets/place-1.png";

  return (
    <section className="region">
      <div className="region-center">
        <div className="region-circle">
          <img src={image} alt={region.name} />
          <div className="region-label">
            <span>{region.name}</span>
            {region.title && <small>{region.title}</small>}
          </div>
        </div>
        <RegionCategories slug={slug} />
      </div>
    </section>
  );
}
