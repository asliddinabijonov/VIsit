import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchRegionFull, fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import {
  buildCardBackground,
  formatDetailText,
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
              {content.length > 0 ? (
                <div className="card-grid columns-3">
                  {content.map((item) => (
                    <article className="info-card" key={item.id}>
                      <div
                        className={`card-visual ${type === "guides" ? "tall" : ""}`}
                        style={buildCardBackground(getPrimaryImage(item))}
                      />
                      <h3>{item.title}</h3>
                      <p>{formatDetailText(item.description, "Tavsif kiritilmagan")}</p>
                      <p>{formatDetailText(item.location, "Manzil kiritilmagan")}</p>
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
              {content.transports.length > 0 ? (
                <div className="card-grid columns-2">
                  {content.transports.map((item) => (
                    <article className="feature-card" key={`transport-${item.id}`}>
                      <div className="feature-visual" style={buildCardBackground(getPrimaryImage(item))} />
                      <h3>{item.title}</h3>
                      <p>{formatDetailText(item.phone_number, "Telefon kiritilmagan")}</p>
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
              ) : (
                <StatusState title="Transportlar yo'q" description="Bu viloyat uchun transport ma'lumoti yo'q." />
              )}

              <div className="services-subheading">
                <h2>Gidlar</h2>
                <p>Mahalliy gid xizmatlari.</p>
              </div>
              {content.guides.length > 0 ? (
                <div className="card-grid columns-2">
                  {content.guides.map((item) => (
                    <article className="feature-card" key={`guide-${item.id}`}>
                      <div className="feature-visual" style={buildCardBackground(getPrimaryImage(item))} />
                      <h3>{item.title || "Gid"}</h3>
                      <p>{formatDetailText(item.language, "Til kiritilmagan")}</p>
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
