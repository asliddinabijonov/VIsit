import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import { buildHeroBackground, findRegionBySlug, formatDetailText } from "../utils/region";

const options = [
  { key: "restaurants", title: "Restaurants", action: "Explore Dining", icon: "R", position: "left-top" },
  { key: "hotels", title: "Hotels", action: "Find Stays", icon: "H", position: "right-top" },
  { key: "tours", title: "Tours & Activities", action: "Discover Experiences", icon: "T", position: "left-bottom" },
  { key: "guides", title: "Travel Guides", action: "Plan Your Trip", icon: "G", position: "right-bottom" },
];

function RegionPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [region, setRegion] = useState(null);
  const [status, setStatus] = useState("loading");

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
          title={status === "error" ? "Xatolik" : "Ma'lumot topilmadi"}
          description={
            status === "error"
              ? "Viloyat ma'lumotlarini backenddan olib bo'lmadi."
              : "Tanlangan viloyat mavjud emas yoki hali backendga qo'shilmagan."
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
            <p className="eyebrow">{region.name}</p>
            <h1>{region.name}</h1>
            <p>{formatDetailText(region.title, "Bu viloyat uchun tavsif hali qo'shilmagan.")}</p>
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

          <div className="bottom-label left-label">Cultural Heritage</div>
          <div className="bottom-label right-label">Travel Tips</div>
        </section>
      )}
    </AppShell>
  );
}

export default RegionPage;
