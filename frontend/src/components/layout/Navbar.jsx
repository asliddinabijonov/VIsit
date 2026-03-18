import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

function Navbar({ mode }) {
  const navigate = useNavigate();
  const { language, languages, setLanguage, t } = useLanguage();
  const [authUser, setAuthUser] = useState("");
  const homeLinks = [
    { label: t("nav.destinations"), to: "/destinations" },
    { label: t("nav.tours"), to: "/experiences" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.travelTips"), to: "/contact" },
    { label: t("nav.blog"), to: "/about" },
  ];
  const regionLinks = [
    { label: t("nav.destinations"), to: "/destinations" },
    { label: t("nav.experiences"), to: "/experiences" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.contact"), to: "/contact" },
  ];
  const links = mode === "home" ? homeLinks : regionLinks;

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

  const handleLogout = () => {
    window.localStorage.removeItem("visit-access-token");
    window.localStorage.removeItem("visit-refresh-token");
    window.localStorage.removeItem("visit-auth-username");
    window.dispatchEvent(new Event("visit-auth-changed"));
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          V
        </span>
        <span>
          <strong>Visit UZBEKISTAN</strong>
          <em>{t("nav.brandTagline")}</em>
        </span>
      </Link>

      <nav className="nav-links">
        {links.map((item) => (
          <Link key={item.label} to={item.to}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        <label className="language-select-wrap">
          <span className="sr-only">{t("nav.language")}</span>
          <select
            className="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label={t("nav.language")}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.name}
              </option>
            ))}
          </select>
        </label>
        {authUser ? (
          <div className="nav-user-menu">
            <div className="nav-user-chip">
              <div className="nav-user-avatar" aria-hidden="true">
                {authUser.slice(0, 1).toUpperCase()}
              </div>
              <div className="nav-user-copy">
                <strong>{authUser}</strong>
              </div>
            </div>
            <div className="nav-user-dropdown">
              <Link to="/profile" className="nav-user-option">
                Profil
              </Link>
              <button type="button" className="nav-user-option danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        ) : mode === "home" ? (
          <Link to="/register" className="button button-primary">
            {t("nav.planTrip")}
          </Link>
        ) : (
          <>
            <Link to="/login" className="button button-ghost small">
              {t("nav.signIn")}
            </Link>
            <Link to="/register" className="button button-primary small">
              {t("nav.register")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
