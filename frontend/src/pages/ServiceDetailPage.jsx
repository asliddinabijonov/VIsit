import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRegionFull, fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import {
  buildServiceFacts,
  buildServiceTitle,
  findServiceItem,
  formatDetailText,
  getAllImages,
  resolveMeta,
  resolveRegionBySlug,
} from "../utils/region";

function ServiceDetailPage() {
  const { slug = "", type = "restaurants", itemKey = "" } = useParams();
  const [region, setRegion] = useState(null);
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");
  const [imageIndex, setImageIndex] = useState(0);

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
  const galleryImages = getAllImages(item);

  useEffect(() => {
    setImageIndex(0);
  }, [slug, type, itemKey]);

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
            <div className="detail-visual-wrap">
              <div className="detail-visual-carousel">
                <div className="detail-visual-track" style={{ transform: `translateX(-${imageIndex * 100}%)` }}>
                  {(galleryImages.length > 0 ? galleryImages : [""]).map((image, index) => (
                    <div key={`${image || "fallback"}-${index}`} className="detail-visual-slide">
                      {image ? (
                        <img
                          src={image}
                          alt={`${buildServiceTitle(type, item)} ${index + 1}`}
                          className="detail-visual-image"
                        />
                      ) : (
                        <div className="detail-visual-fallback" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {galleryImages.length > 1 && (
                <div className="detail-thumbs">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-thumb`}
                      type="button"
                      className={`detail-thumb ${index === imageIndex ? "active" : ""}`}
                      onClick={() => setImageIndex(index)}
                      aria-label={`Rasm ${index + 1}`}
                    >
                      <img src={image} alt={`Kichik rasm ${index + 1}`} className="detail-thumb-image" />
                    </button>
                  ))}
                </div>
              )}
            </div>
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
