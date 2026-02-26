export default function DetailHero({ title, subtitle, image, actions }) {
  return (
    <section className="detail-hero">
      <div className="detail-hero-image">
        <img src={image} alt={title} />
      </div>
      <div className="detail-hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {actions && <div className="detail-hero-actions">{actions}</div>}
      </div>
    </section>
  );
}
