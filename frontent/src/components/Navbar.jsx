import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-title">Visit Uzbekistan</div>
        <div className="brand-subtitle">Ipak yo'lini kashf eting</div>
      </div>

      <button
        className="navbar-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar-links ${open ? "open" : ""}`}>
        <NavLink to="/" end>
          Yo'nalishlar
        </NavLink>
        <a href="#tours">Turlar</a>
        <a href="#about">Biz haqimizda</a>
        <a href="#tips">Sayohat maslahatlari</a>
        <a href="#blog">Maqolalar</a>
      </nav>

      <div className="navbar-cta">
        <button className="btn btn-primary">Sayohatni rejalash</button>
      </div>
    </header>
  );
}
