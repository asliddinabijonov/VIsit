import Navbar from "./Navbar";

function AppShell({ children, navMode = "home" }) {
  return (
    <div className={`app-shell app-shell-${navMode}`}>
      <div className="stars stars-a" />
      <div className="stars stars-b" />
      <div className="glow glow-left" />
      <div className="glow glow-right" />
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />
      <Navbar mode={navMode} />
      <main className="page-content">{children}</main>
    </div>
  );
}

export default AppShell;
