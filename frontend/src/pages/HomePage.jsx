import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";
import { getOrbitRegions, slugifyRegionName } from "../utils/region";

function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [regions, setRegions] = useState([]);
  const [status, setStatus] = useState("loading");
  const [authUser, setAuthUser] = useState("");
  const [activePanel, setActivePanel] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const syncOverflow = () => {
      document.body.style.overflow = mediaQuery.matches ? "auto" : "hidden";
    };

    syncOverflow();
    mediaQuery.addEventListener("change", syncOverflow);

    return () => {
      mediaQuery.removeEventListener("change", syncOverflow);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

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

  useEffect(() => {
    const syncAuthUser = () => {
      setAuthUser(window.localStorage.getItem("visit-auth-username") || "");
    };

    syncAuthUser();
    window.addEventListener("storage", syncAuthUser);
    window.addEventListener("visit-auth-changed", syncAuthUser);

    return () => {
      window.removeEventListener("storage", syncAuthUser);
      window.removeEventListener("visit-auth-changed", syncAuthUser);
    };
  }, []);

  const orbitRegions = getOrbitRegions(regions);
  const isAuthenticated = Boolean(authUser);

  const handleHeroAction = (panelKey) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActivePanel((current) => (current === panelKey ? "" : panelKey));
  };

  const homePanels = {
    explore: {
      eyebrow: t("home.exploreEyebrow"),
      title: t("home.exploreTitle"),
      description: t("home.exploreDescription", { user: authUser }),
      cards: [
        {
          title: t("home.exploreCardOneTitle"),
          text: t("home.exploreCardOneText"),
        },
        {
          title: t("home.exploreCardTwoTitle"),
          text: t("home.exploreCardTwoText"),
        },
        {
          title: t("home.exploreCardThreeTitle"),
          text: t("home.exploreCardThreeText"),
        },
      ],
    },
    journey: {
      eyebrow: t("home.journeyEyebrow"),
      title: t("home.journeyTitle"),
      description: t("home.journeyDescription", { user: authUser }),
      cards: [
        {
          title: t("home.journeyCardOneTitle"),
          text: t("home.journeyCardOneText"),
        },
        {
          title: t("home.journeyCardTwoTitle"),
          text: t("home.journeyCardTwoText"),
        },
        {
          title: t("home.journeyCardThreeTitle"),
          text: t("home.journeyCardThreeText"),
        },
      ],
    },
  };

  const activeContent = activePanel ? homePanels[activePanel] : null;

  return (
    <AppShell navMode="home">
      <section className="home-hero">
        <div className="orbit-stage orbit-stage-home">
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <div className="orbit orbit-3" />
          <div className="constellation constellation-left" />
          <div className="constellation constellation-right" />

          <div className="home-image-wrap">
            <div className="home-image-ring home-image-ring-a" />
            <div className="home-image-ring home-image-ring-b" />
            <div className="home-image-frame">
              <img className="home-image" src="/images/children.png" alt={t("home.imageAlt")} />
            </div>
          </div>

          {status === "success" && (
            <div className="orbit-regions-layer" aria-label={t("home.orbitLabel")}>
              {orbitRegions.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  className="orbit-region-item region-pill"
                  style={{ "--orbit-index": region.orbitIndex }}
                  onClick={() => navigate(`/region/${slugifyRegionName(region.name)}`)}
                >
                  {region.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {status === "loading" && (
          <StatusState title={t("home.loadingTitle")} description={t("home.loadingDescription")} />
        )}

        {status === "error" && <StatusState title={t("home.errorTitle")} description={t("home.errorDescription")} />}

        <div className="hero-actions">
          <button type="button" className="button button-primary large" onClick={() => handleHeroAction("explore")}>
            {t("home.primaryCta")}
          </button>
          <button type="button" className="button button-dark large" onClick={() => handleHeroAction("journey")}>
            <span className="play-icon" aria-hidden="true">
              &gt;
            </span>
            {t("home.secondaryCta")}
          </button>
        </div>

        {!isAuthenticated && (
          <div className="home-auth-note">
            <strong>{t("home.authRequiredTitle")}</strong>
            <p>{t("home.authRequiredDescription")}</p>
          </div>
        )}

        {isAuthenticated && activeContent && (
          <section className="home-member-panel">
            <div className="home-member-head">
              <p className="eyebrow">{activeContent.eyebrow}</p>
              <h2>{activeContent.title}</h2>
              <p>{activeContent.description}</p>
            </div>

            <div className="home-member-grid">
              {activeContent.cards.map((card) => (
                <article className="home-member-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </AppShell>
  );
}

export default HomePage;
