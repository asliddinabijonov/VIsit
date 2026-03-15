import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchRegionFull, fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import {
  buildCardBackground,
  getItemKey,
  getPrimaryImage,
  mapServiceContent,
  resolveMeta,
  resolveRegionBySlug,
} from "../utils/region";

function RegionServicesPage() {
  const { slug = "", type = "restaurants" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [region, setRegion] = useState(null);
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loading");
  const [mainIndex, setMainIndex] = useState(0);
  const [transportIndex, setTransportIndex] = useState(0);
  const [guideIndex, setGuideIndex] = useState(0);

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

        if (!active) {
          return;
        }

        setRegion(currentRegion);
        setContent(mapServiceContent(full, type));
        setStatus("success");
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
  }, [slug, type]);

  const shortText = (value, fallback = "Yo'q") => {
    const normalized = String(value || "").replace(/\s+/g, " ").trim();

    if (!normalized) {
      return fallback;
    }

    return normalized.length > 72 ? `${normalized.slice(0, 69).trim()}...` : normalized;
  };

  const buildShortMeta = (item) => {
    const features = Array.isArray(item?.xususiyat_detail)
      ? item.xususiyat_detail.map((entry) => entry?.turi).filter(Boolean).join(", ")
      : "";

    const rows = [
      { label: "Description", value: shortText(item?.description) },
      { label: "Joylashuv", value: shortText(region?.name, "Kiritilmagan") },
      { label: "Telefon", value: shortText(item?.phone_number, "Kiritilmagan") },
      { label: "Vaqti", value: shortText(item?.working_time || item?.schedule || item?.date) },
    ];

    if (features) {
      rows.push({ label: "Imkoniyatlari", value: shortText(features) });
    }

    return rows;
  };

  const rotateVisible = (items, startIndex, size = 3) => {
    if (!Array.isArray(items) || items.length <= size) {
      return items || [];
    }

    return Array.from({ length: size }, (_, offset) => items[(startIndex + offset) % items.length]);
  };

  const mainItems = useMemo(() => (Array.isArray(content) ? content : []), [content]);
  const visibleMainItems = useMemo(() => rotateVisible(mainItems, mainIndex, 3), [mainItems, mainIndex]);
  const tourTransports = useMemo(() => (content?.transports ? content.transports : []), [content]);
  const tourGuides = useMemo(() => (content?.guides ? content.guides : []), [content]);
  const visibleTransports = useMemo(() => rotateVisible(tourTransports, transportIndex, 3), [tourTransports, transportIndex]);
  const visibleGuides = useMemo(() => rotateVisible(tourGuides, guideIndex, 3), [tourGuides, guideIndex]);

  useEffect(() => {
    setMainIndex(0);
    setTransportIndex(0);
    setGuideIndex(0);
  }, [slug, type]);

  const movePrev = (length, setter) => {
    if (length <= 3) {
      return;
    }

    setter((current) => (current - 1 + length) % length);
  };

  const moveNext = (length, setter) => {
    if (length <= 3) {
      return;
    }

    setter((current) => (current + 1) % length);
  };

  const renderControls = (length, currentIndex, setter) => {
    if (length <= 3) {
      return null;
    }

    return (
      <div className="carousel-controls bottom" aria-label="Ro'yxat boshqaruvi">
        <button type="button" className="carousel-arrow" onClick={() => movePrev(length, setter)}>
          &#8249;
        </button>
        <div className="carousel-dots" aria-hidden="true">
          {Array.from({ length }).map((_, dotIndex) => (
            <span key={`dot-${dotIndex}`} className={`carousel-dot ${dotIndex === currentIndex ? "active" : ""}`} />
          ))}
        </div>
        <button type="button" className="carousel-arrow" onClick={() => moveNext(length, setter)}>
          &#8250;
        </button>
      </div>
    );
  };

  const meta = resolveMeta(type);

  return (
    <AppShell navMode="region">
      {status !== "success" && (
        <StatusState
          title={status === "error" ? "Xatolik" : "Ma'lumot topilmadi"}
          description={status === "error" ? "Xizmatlar backenddan yuklanmadi." : "Bu viloyat uchun ma'lumot topilmadi."}
        />
      )}

      {status === "success" && region && content && (
        <section className="services-page">
          <div className="services-heading">
            <p className="eyebrow">{region.name}</p>
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
          </div>

          {(type === "restaurants" || type === "hotels" || type === "guides") && (
            <>
              {mainItems.length > 0 ? (
                <>
                  <div className="card-grid columns-3 carousel-grid">
                    {visibleMainItems.map((item) => (
                      <article className="info-card" key={item.id}>
                        <div
                          className={`card-visual ${type === "guides" ? "tall" : ""}`}
                          style={buildCardBackground(getPrimaryImage(item))}
                        />
                        <h3>{item.title}</h3>
                        <div className="card-meta-list">
                          {buildShortMeta(item).map((meta) => (
                            <p key={`${item.id}-${meta.label}`}>
                              <strong>{meta.label}:</strong> {meta.value}
                            </p>
                          ))}
                        </div>
                        <div className="card-actions">
                          <button
                            type="button"
                            className="button button-primary small"
                            onClick={() => navigate(`/region/${slug}/services/${type}/${getItemKey(type, item)}`)}
                          >
                            Batafsil
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  {renderControls(mainItems.length, mainIndex, setMainIndex)}
                </>
              ) : (
                <StatusState title="Ro'yxat bo'sh" description="Bu bo'lim uchun ma'lumot hali qo'shilmagan." />
              )}
            </>
          )}

          {type === "tours" && (
            <div className="service-sections">
              <div className="services-subheading">
                <h2>Transportlar</h2>
                <p>Hududdagi transport xizmatlari.</p>
              </div>
              {tourTransports.length > 0 ? (
                <>
                  <div className="card-grid columns-3 carousel-grid">
                    {visibleTransports.map((item) => (
                      <article className="feature-card" key={`transport-${item.id}`}>
                        <div className="feature-visual" style={buildCardBackground(getPrimaryImage(item))} />
                        <h3>{item.title}</h3>
                        <div className="card-meta-list">
                          {buildShortMeta(item).map((meta) => (
                            <p key={`${item.id}-${meta.label}`}>
                              <strong>{meta.label}:</strong> {meta.value}
                            </p>
                          ))}
                        </div>
                        <div className="card-actions">
                          <button
                            type="button"
                            className="button button-primary small"
                            onClick={() =>
                              navigate(`/region/${slug}/services/${type}/${getItemKey(type, { ...item, kind: "transport" })}`)
                            }
                          >
                            Batafsil
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  {renderControls(tourTransports.length, transportIndex, setTransportIndex)}
                </>
              ) : (
                <StatusState title="Transportlar yo'q" description="Bu viloyat uchun transport ma'lumoti yo'q." />
              )}

              <div className="services-subheading">
                <h2>Gidlar</h2>
                <p>Mahalliy gid xizmatlari.</p>
              </div>
              {tourGuides.length > 0 ? (
                <>
                  <div className="card-grid columns-3 carousel-grid">
                    {visibleGuides.map((item) => (
                      <article className="feature-card" key={`guide-${item.id}`}>
                        <div className="feature-visual" style={buildCardBackground(getPrimaryImage(item))} />
                        <h3>{item.title || "Gid"}</h3>
                        <div className="card-meta-list">
                          {buildShortMeta(item).map((meta) => (
                            <p key={`${item.id}-${meta.label}`}>
                              <strong>{meta.label}:</strong> {meta.value}
                            </p>
                          ))}
                        </div>
                        <div className="card-actions">
                          <button
                            type="button"
                            className="button button-primary small"
                            onClick={() =>
                              navigate(`/region/${slug}/services/${type}/${getItemKey(type, { ...item, kind: "guide" })}`)
                            }
                          >
                            Batafsil
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  {renderControls(tourGuides.length, guideIndex, setGuideIndex)}
                </>
              ) : (
                <StatusState title="Gidlar yo'q" description="Bu viloyat uchun gid ma'lumoti yo'q." />
              )}
            </div>
          )}

          <div className="services-footer-note">Manzil: {location.pathname}</div>
        </section>
      )}
    </AppShell>
  );
}

export default RegionServicesPage;
