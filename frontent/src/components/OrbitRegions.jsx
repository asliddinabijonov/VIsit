import { Link } from "react-router-dom";

export default function OrbitRegions({ regions }) {
  return (
    <div className="orbit">
      <div className="orbit-ring" />
      <div className="orbit-ring orbit-ring-secondary" />
      <div className="orbit-items">
        {regions.map((region, index) => {
          const angle = (index / regions.length) * 360;
          return (
            <Link
              key={region.id}
              to={`/region/${region.slug}`}
              className="orbit-pill"
              style={{ "--angle": `${angle}deg` }}
            >
              {region.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
