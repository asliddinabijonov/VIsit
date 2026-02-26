import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout({ children }) {
  return (
    <div className="app">
      <div className="galaxy-overlay" aria-hidden="true" />
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
      <div className="corner corner-tl" aria-hidden="true" />
      <div className="corner corner-tr" aria-hidden="true" />
      <div className="corner corner-bl" aria-hidden="true" />
      <div className="corner corner-br" aria-hidden="true" />
    </div>
  );
}
