import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";

const copy = {
  uz: {
    eyebrow: "Tajribalar",
    title: "Sayohatni oddiy ro'yxatdan tajribaga aylantiring",
    description:
      "Platforma faqat joylar ro'yxatini emas, balki VR, 360 video, mahalliy gidlar va transport bilan bog'langan immersive marshrutlarni taklif qiladi.",
    sections: [
      {
        title: "360 va VR sayohatlar",
        text: "Tarixiy obidalarni avval brauzerda ko'ring, keyin VR qurilmada chuqurroq tajriba oling.",
      },
      {
        title: "Mahalliy gidlar bilan safar",
        text: "Har bir hududni uning tarixi, afsonalari va real hayoti bilan tushuntirib beradigan gidlar bilan tanishing.",
      },
      {
        title: "Taom va tunash bir marshrutda",
        text: "Restoran, mehmonxona va transport xizmatlarini bir safar ichida birlashtirish osonlashadi.",
      },
    ],
  },
  en: {
    eyebrow: "Experiences",
    title: "Turn travel from a list into an experience",
    description:
      "The platform is not just a directory of places. It connects VR, 360 video, local guides, and transport into immersive routes.",
    sections: [
      {
        title: "360 and VR journeys",
        text: "Preview landmarks in the browser first, then continue the experience on a VR device.",
      },
      {
        title: "Travel with local guides",
        text: "Meet guides who explain each region through its history, legends, and everyday life.",
      },
      {
        title: "Food and stay in one route",
        text: "Restaurants, hotels, and transport can be combined into a single travel plan.",
      },
    ],
  },
};

function ExperiencesPage() {
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

        <div className="experience-grid">
          {text.sections.map((section) => (
            <article className="info-panel experience-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default ExperiencesPage;
