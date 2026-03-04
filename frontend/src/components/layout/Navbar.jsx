import { Link } from "react-router-dom";

function Navbar({ mode }) {
  const homeLinks = ["Destinations", "Tours", "About Us", "Travel Tips", "Blog"];
  const regionLinks = ["Destinations", "Experiences", "About Us", "Contact"];
  const links = mode === "home" ? homeLinks : regionLinks;

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          V
        </span>
        <span>
          <strong>Visit UZBEKISTAN</strong>
          <em>Discover the Silk Road</em>
        </span>
      </Link>

      <nav className="nav-links">
        {links.map((item) => (
          <a key={item} href="#!" onClick={(event) => event.preventDefault()}>
            {item}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        {mode === "home" ? (
          <Link to="/register" className="button button-primary">
            Plan Your Trip
          </Link>
        ) : (
          <>
            <button type="button" className="button button-ghost small">
              Sign In
            </button>
            <Link to="/register" className="button button-primary small">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
