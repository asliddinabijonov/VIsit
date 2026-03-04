import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRegionFull, fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import {
  buildCardBackground,
  buildServiceFacts,
  buildServiceTitle,
  findServiceItem,
  formatDetailText,
  getPrimaryImage,
  resolveMeta,
  resolveRegionBySlug,
} from "../utils/region";

function ServiceDetailPage() {
  const { slug = "", type = "restaurants", itemKey = "" } = useParams();
  const [region, setRegion] = useState(null);
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const regions = await fetchRegions();
        const currentRegion = resolveRegionBySlug(regions, slug);

        if (!currentRegion) {
          if (active) {
            setStatus("empty");
          }
          return;
        }

        const full = await fetchRegionFull(currentRegion.id);
        const currentItem = findServiceItem(full, type, itemKey);

        if (!active) {
          return;
        }

        setRegion(currentRegion);
        setItem(currentItem);
        setStatus(currentItem ? "success" : "empty");
      } catch {
        if (active) {
          setStatus("error");
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [itemKey, slug, type]);

  const meta = resolveMeta(type);
  const facts = buildServiceFacts(type, item);
  const comments = item?.comments || [];

  return (
    <AppShell navMode="region">
      {status !== "success" && (
        <StatusState
          title={status === "error" ? "Xatolik" : "Ma'lumot topilmadi"}
          description={
            status === "error" ? "Batafsil sahifa yuklanmadi." : "Tanlangan obyekt uchun ma'lumot topilmadi."
          }
        />
      )}

      {status === "success" && item && region && (
        <section className="detail-page">
          <div className="detail-hero">
            <div className="detail-visual" style={buildCardBackground(getPrimaryImage(item))} />
            <div className="detail-copy">
              <p className="eyebrow">
                {region.name} / {meta.title}
              </p>
              <h1>{buildServiceTitle(type, item)}</h1>
              <p>{formatDetailText(item.description, "Bu obyekt uchun tavsif hali kiritilmagan.")}</p>
              <Link to={`/region/${slug}/services/${type}`} className="button button-ghost small">
                Ro'yxatga qaytish
              </Link>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-panel">
              <h2>Asosiy ma'lumotlar</h2>
              <div className="facts-grid">
                {facts.map((fact) => (
                  <div className="fact-card" key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-panel">
              <h2>Izohlar</h2>
              {comments.length > 0 ? (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <article className="comment-card" key={comment.id}>
                      <p>{comment.comment}</p>
                      <span>Reyting: {comment.rating || "yo'q"}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-note">Hozircha izohlar mavjud emas.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </AppShell>
  );
}

export default ServiceDetailPage;
