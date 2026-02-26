import { useEffect, useState } from "react";
import OrbitRegions from "../components/OrbitRegions.jsx";
import Loading from "../components/Loading.jsx";
import { getRegions } from "../api";

export default function HomePage() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getRegions()
      .then((data) => {
        if (mounted) {
          setRegions(data);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="home">
      <div className="home-center">
        <div className="home-hero">
          <img src="/assets/hero-children.jpg" alt="O'zbek bolalari" />
        </div>
        {loading ? <Loading /> : <OrbitRegions regions={regions} />}
      </div>
      <div className="home-actions">
        <button className="btn btn-primary">O'zbekistonni kashf eting</button>
        <button className="btn btn-secondary">Videoni tomosha qiling</button>
      </div>
    </section>
  );
}
