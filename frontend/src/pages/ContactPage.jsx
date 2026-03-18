import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";

const copy = {
  uz: {
    eyebrow: "Aloqa",
    title: "Hamkorlik va savollar uchun bog'laning",
    description:
      "Turizm operatorlari, gidlar, mehmonxona va restoran egalari bilan ishlash uchun alohida aloqa kanallari tayyorlangan.",
    cards: [
      { title: "Hamkorlik", value: "partners@visituzbekistan.uz" },
      { title: "Qo'llab-quvvatlash", value: "+998 90 123 45 67" },
      { title: "Ofis", value: "Toshkent, Amir Temur shoh ko'chasi" },
    ],
  },
  en: {
    eyebrow: "Contact",
    title: "Get in touch for partnerships and questions",
    description:
      "Dedicated contact channels are prepared for tourism operators, guides, hotel owners, and restaurant partners.",
    cards: [
      { title: "Partnerships", value: "partners@visituzbekistan.uz" },
      { title: "Support", value: "+998 90 123 45 67" },
      { title: "Office", value: "Tashkent, Amir Temur Avenue" },
    ],
  },
};

function ContactPage() {
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
          {text.cards.map((card) => (
            <div className="info-panel" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.value}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default ContactPage;
