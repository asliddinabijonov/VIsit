import { useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div className="tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-btn ${active === tab.key ? "active" : ""}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.map((tab) =>
          active === tab.key ? (
            <div key={tab.key} className="tab-panel">
              {tab.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
