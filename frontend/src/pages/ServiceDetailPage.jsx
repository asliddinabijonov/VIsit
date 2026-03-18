import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRegionFull, fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";
import {
  buildServiceFacts,
  buildServiceTitle,
  findServiceItem,
  formatDetailText,
  getAllImages,
  getPosterUrl,
  getVideoTypeLabel,
  getVideoUrl,
  resolveMeta,
  resolveRegionBySlug,
} from "../utils/region";

function ServiceDetailPage() {
  const { slug = "", type = "restaurants", itemKey = "" } = useParams();
  const { t } = useLanguage();
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

  const meta = resolveMeta(type, t);
  const facts = buildServiceFacts(type, item, t);
  const comments = item?.comments || [];
  const galleryImages = getAllImages(item);
  const videoUrl = getVideoUrl(item);
  const posterUrl = getPosterUrl(item);
  const isVideo360 = item?.video_type === "360";

  useEffect(() => {
    setImageIndex(0);
  }, [slug, type, itemKey]);

  const isMapUrl = (value) => {
    if (!value || typeof value !== "string") {
      return false;
    }

    return /^https?:\/\//i.test(value) && /(google\.[^/]+\/maps|google\.com\/maps|maps\.app\.goo\.gl|yandex|openstreetmap)/i.test(value);
  };

  const getMapEmbedUrl = (value) => {
    if (!isMapUrl(value)) {
      return "";
    }

    try {
      const parsed = new URL(value);
      const directQuery =
        parsed.searchParams.get("q") ||
        parsed.searchParams.get("query") ||
        parsed.searchParams.get("destination") ||
        parsed.searchParams.get("ll");

      if (directQuery) {
        return `https://www.google.com/maps?q=${encodeURIComponent(directQuery)}&output=embed`;
      }

      if (parsed.hostname.includes("openstreetmap")) {
        return value;
      }

      return `https://www.google.com/maps?q=${encodeURIComponent(value)}&output=embed`;
    } catch {
      return "";
    }
  };

  const mapFact = facts.find((fact) => fact.label === t("services.location") && isMapUrl(fact.value));
  const visibleFacts = facts.filter((fact) => !(fact.label === t("services.location") && isMapUrl(fact.value)));
  const mapEmbedUrl = getMapEmbedUrl(mapFact?.value || item?.location || "");
  const sidePanelContent = videoUrl ? "video" : mapEmbedUrl ? "map" : "";

  return (
    <AppShell navMode="region">
      {status !== "success" && (
        <StatusState
          title={status === "error" ? t("detail.errorTitle") : t("detail.emptyTitle")}
          description={
            status === "error" ? t("detail.errorDescription") : t("detail.emptyDescription")
          }
        />
      )}

      {status === "success" && item && region && (
        <section className="detail-page">
          <div className="detail-media-panel">
            <div className="detail-media-head">
              <div className="detail-copy">
                <p className="eyebrow">
                  {region.name} / {meta.title}
                </p>
                <h1>{buildServiceTitle(type, item, t)}</h1>
              </div>
              <Link to={`/region/${slug}/services/${type}`} className="button button-ghost small">
                {t("detail.backToList")}
              </Link>
            </div>

            <div className="detail-visual-wrap">
              <div className="detail-visual-carousel detail-visual-stage">
                <div className="detail-visual-track" style={{ transform: `translateX(-${imageIndex * 100}%)` }}>
                  {(galleryImages.length > 0 ? galleryImages : [""]).map((image, index) => (
                    <div key={`${image || "fallback"}-${index}`} className="detail-visual-slide detail-visual-slide-large">
                      {image ? (
                        <img
                          src={image}
                          alt={`${buildServiceTitle(type, item, t)} ${index + 1}`}
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
                <div className="detail-thumbs detail-thumbs-bar">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-thumb`}
                      type="button"
                      className={`detail-thumb ${index === imageIndex ? "active" : ""}`}
                      onClick={() => setImageIndex(index)}
                      aria-label={t("detail.thumbLabel", { index: index + 1 })}
                    >
                      <img src={image} alt={t("detail.thumbAlt", { index: index + 1 })} className="detail-thumb-image" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`detail-info-panel ${!sidePanelContent ? "single-column" : ""}`}>
            <div className="detail-panel detail-panel-main">
              <h2>{t("detail.mainInfo")}</h2>
              <div className="detail-description-block">
                <p>{formatDetailText(item.description, t("detail.descriptionFallback"))}</p>
              </div>
              <div className="facts-grid facts-grid-split">
                {visibleFacts.map((fact) => (
                  <div className="fact-card" key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {sidePanelContent === "video" && (
              <div className="detail-panel detail-panel-side">
                <div className="detail-video-panel">
                  <div className="detail-panel-head">
                    <h2>{t("detail.videoVr")}</h2>
                    <span className={`video-badge ${isVideo360 ? "mode-360" : ""}`}>
                      {getVideoTypeLabel(item?.video_type, t)}
                    </span>
                  </div>
                  <div className={`video-player-wrap ${isVideo360 ? "is-360" : ""}`}>
                    <video className="detail-video-player" controls playsInline poster={posterUrl || undefined}>
                      <source src={videoUrl} />
                      {t("detail.unsupportedVideo")}
                    </video>
                    {isVideo360 && <div className="video-orbit-hint">360</div>}
                  </div>
                  <div className="video-actions">
                    <a className="button button-dark small" href={videoUrl} target="_blank" rel="noreferrer">
                      {t("detail.openNewWindow")}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {sidePanelContent === "map" && (
              <div className="detail-panel detail-panel-side">
                <div className="detail-video-panel">
                  <div className="detail-panel-head">
                    <h2>Map</h2>
                  </div>
                  <div className="detail-map-panel">
                    <iframe
                      className="detail-map-frame"
                      src={mapEmbedUrl}
                      title={`${buildServiceTitle(type, item, t)} map`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  {mapFact?.value && (
                    <div className="video-actions">
                      <a className="button button-dark small" href={mapFact.value} target="_blank" rel="noreferrer">
                        Open Map
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="detail-comments-panel detail-panel">
            <div className="detail-panel-head">
              <h2>{t("detail.comments")}</h2>
              <span className="comments-count">{comments.length}</span>
            </div>
            {comments.length > 0 ? (
              <div className="comments-list comments-list-wide">
                {comments.map((comment) => (
                  <article className="comment-card comment-card-wide" key={comment.id}>
                    <div className="comment-avatar" aria-hidden="true">
                      {String(comment.user || "U").slice(0, 1)}
                    </div>
                    <div className="comment-body">
                      <p>{comment.comment}</p>
                      <span>{t("detail.rating", { value: comment.rating || t("detail.ratingMissing") })}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-note">{t("detail.noComments")}</p>
            )}
          </div>
        </section>
      )}
    </AppShell>
  );
}

export default ServiceDetailPage;
