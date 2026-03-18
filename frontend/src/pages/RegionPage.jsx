import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";
import { buildHeroBackground, findRegionBySlug, formatDetailText } from "../utils/region";

function RegionPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [region, setRegion] = useState(null);
  const [status, setStatus] = useState("loading");

  const options = [
    { key: "restaurants", title: t("region.restaurantsTitle"), action: t("region.restaurantsAction"), icon: "R", position: "left-top" },
    { key: "hotels", title: t("region.hotelsTitle"), action: t("region.hotelsAction"), icon: "H", position: "right-top" },
    { key: "tours", title: t("region.toursTitle"), action: t("region.toursAction"), icon: "T", position: "left-bottom" },
    { key: "guides", title: t("region.guidesTitle"), action: t("region.guidesAction"), icon: "G", position: "right-bottom" },
  ];

  useEffect(() => {
    let active = true;

    fetchRegions()
      .then((data) => {
        if (!active) {
          return;
        }

        const currentRegion = findRegionBySlug(data, slug);
        setRegion(currentRegion);
        setStatus(currentRegion ? "success" : "empty");
      })
      .catch(() => {
        if (active) {
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <AppShell navMode="region">
      {status !== "success" && (
        <StatusState
          title={status === "error" ? t("region.errorTitle") : t("region.emptyTitle")}
          description={
            status === "error"
              ? t("region.errorDescription")
              : t("region.emptyDescription")
          }
        />
      )}

      {region && (
        <section className="region-stage">
          <div className="region-circle-wrap">
            <div className="region-ring region-ring-outer" />
            <div className="region-ring region-ring-inner" />
            <div className="region-scene region-scene-clean" style={buildHeroBackground(region.image)} />
          </div>

          <div className="region-scene-copy">
            <h1>{region.name}</h1>
            <p>{formatDetailText(region.title, t("region.descriptionFallback"))}</p>
          </div>

          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`region-option ${option.position}`}
              onClick={() => navigate(`/region/${slug}/services/${option.key}`)}
            >
              <span className="region-option-title">{option.title}</span>
              <span className="region-option-icon">{option.icon}</span>
              <span className="region-option-action">{option.action}</span>
            </button>
          ))}

          <div className="bottom-label left-label">{t("region.heritage")}</div>
          <div className="bottom-label right-label">{t("region.travelTips")}</div>
        </section>
      )}
    </AppShell>
  );
}

export default RegionPage;
