import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRegions } from "../api/visitApi";
import StatusState from "../components/common/StatusState";
import AppShell from "../components/layout/AppShell";
import { getOrbitRegions, slugifyRegionName } from "../utils/region";

function HomePage() {
  const navigate = useNavigate();
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

  const orbitRegions = getOrbitRegions(regions);

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
              <img className="home-image" src="/images/children.png" alt="Uzbekistan cultural travel" />
            </div>
          </div>

          {status === "success" && (
            <div className="orbit-regions-layer" aria-label="Viloyatlar harakati">
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
          <StatusState title="Yuklanmoqda" description="Viloyatlar ro'yxati backenddan olinmoqda." />
        )}

        {status === "error" && (
          <StatusState title="Xatolik" description="Backend bilan ulanishda muammo bo'ldi." />
        )}

        <div className="hero-copy-card">
          <p className="hero-kicker">Cosmic Silk Road</p>
          <h1>O'zbekiston bo'ylab sayohatni yangi vizual uslubda boshlang</h1>
        </div>

        <div className="hero-actions">
          <button type="button" className="button button-primary large" onClick={() => navigate("/register")}>
            Explore Uzbekistan
          </button>
          <button type="button" className="button button-dark large" onClick={() => navigate("/register")}>
            <span className="play-icon" aria-hidden="true">
              &gt;
            </span>
            Start Journey
          </button>
        </div>
      </section>
    </AppShell>
  );
}

export default HomePage;
