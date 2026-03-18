import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";
import { normalizeMediaUrl, slugifyRegionName } from "../utils/region";

const copy = {
  uz: {
    eyebrow: "Yo'nalishlar",
    title: "O'zbekiston bo'ylab asosiy manzillar",
    description:
      "Har bir viloyat o'ziga xos tarix, taom, me'morchilik va sayohat ritmiga ega. Boshlash uchun hududlardan birini tanlang.",
    highlightTitle: "Nimani topasiz",
    highlights: [
      "Ipak yo'li shaharlari va tarixiy obidalar",
      "Mahalliy oshxona, bozorlar va hunarmandlar maskanlari",
      "Tog', cho'l va shahar tajribalarini birlashtirgan marshrutlar",
    ],
  },
  en: {
    eyebrow: "Destinations",
    title: "Key destinations across Uzbekistan",
    description:
      "Each region carries its own rhythm of history, cuisine, architecture, and travel experiences. Choose a region to begin.",
    highlightTitle: "What you'll find",
    highlights: [
      "Silk Road cities and historic landmarks",
      "Local cuisine, markets, and artisan quarters",
      "Routes that combine mountains, desert, and urban culture",
    ],
  },
};

function DestinationsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = copy[language] || copy.en;
  const [regions, setRegions] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    fetchRegions()
      .then((data) => {
        if (!active) {
          return;
        }
        setRegions(Array.isArray(data) ? data : []);
        setStatus("success");
      })
      .catch(() => {
        if (active) {
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(() => regions.slice(0, 12), [regions]);

  return (
    <AppShell navMode="region">
      <section className="info-page">
        <div className="info-hero">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>

        <div className="info-panel">
          <h2>{text.highlightTitle}</h2>
          <div className="info-points">
            {text.highlights.map((item) => (
              <div className="fact-card" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>

        {status === "loading" && <StatusState title="Loading" description="Regions are loading." />}
        {status === "error" && <StatusState title="Error" description="Failed to load destinations." />}

        {status === "success" && (
          <div className="destination-grid">
            {cards.map((region) => (
              <article className="destination-card" key={region.id}>
                <div
                  className="destination-card-visual"
                  style={{
                    backgroundImage: region.image
                      ? `linear-gradient(180deg, rgba(10,17,38,.18), rgba(10,17,38,.72)), url("${normalizeMediaUrl(
                          region.image,
                        )}")`
                      : undefined,
                  }}
                />
                <div className="destination-card-copy">
                  <h3>{region.name}</h3>
                  <p>{region.title || region.name}</p>
                  <button
                    type="button"
                    className="button button-primary small"
                    onClick={() => navigate(`/region/${slugifyRegionName(region.name)}`)}
                  >
                    Open Region
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

export default DestinationsPage;
