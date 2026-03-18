import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";

const copy = {
  uz: {
    eyebrow: "Biz haqimizda",
    title: "Visit Uzbekistan raqamli sayohat platformasi",
    description:
      "Loyiha O'zbekiston bo'ylab sayohatni zamonaviyroq ko'rsatish uchun yaratilgan: hududlar, xizmatlar, gidlar, 360 media va immersive ko'rish usullari bitta ekotizimda jamlanadi.",
    stats: [
      { label: "Asosiy yo'nalish", value: "Madaniy turizm" },
      { label: "Format", value: "Web + immersive media" },
      { label: "Maqsad", value: "Qulay rejalash va kashfiyot" },
    ],
  },
  en: {
    eyebrow: "About Us",
    title: "Visit Uzbekistan digital travel platform",
    description:
      "The project is built to present travel across Uzbekistan in a more modern way: regions, services, guides, 360 media, and immersive viewing live in one ecosystem.",
    stats: [
      { label: "Primary focus", value: "Cultural tourism" },
      { label: "Format", value: "Web + immersive media" },
      { label: "Goal", value: "Faster planning and discovery" },
    ],
  },
};

function AboutPage() {
  const { language } = useLanguage();
  const text = copy[language] || copy.en;

  return (
    <AppShell navMode="region">
      <section className="info-page">
        <div className="info-hero">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>

        <div className="info-points">
          {text.stats.map((item) => (
            <div className="info-panel" key={item.label}>
              <h2>{item.label}</h2>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default AboutPage;
