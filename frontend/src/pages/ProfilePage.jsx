import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createOwnedResource,
  deleteOwnedResource,
  fetchCurrentUser,
  fetchOwnedResources,
  fetchRegions,
} from "../api/visitApi";
import AppShell from "../components/layout/AppShell";

const resourceConfig = {
  HOTEL_OWNER: {
    resource: "mehmonxonalar",
    title: "Mehmonxona profili",
    description: "Faqat o'zingizning mehmonxonalaringizni qo'shish, ko'rish va o'chirish mumkin.",
    fields: [
      { name: "title", label: "Nomi", required: true },
      { name: "viloyat", label: "Viloyat", type: "select", required: true },
      { name: "description", label: "Tavsif", type: "textarea" },
      { name: "location", label: "Manzil" },
      { name: "date", label: "Sana", type: "date" },
      { name: "phone_number", label: "Telefon" },
      { name: "email", label: "Email", type: "email" },
    ],
  },
  RESTAURANT_OWNER: {
    resource: "restoranlar",
    title: "Restoran profili",
    description: "Faqat o'zingizning restoranlaringizni qo'shish, ko'rish va o'chirish mumkin.",
    fields: [
      { name: "title", label: "Nomi", required: true },
      { name: "viloyat", label: "Viloyat", type: "select", required: true },
      { name: "description", label: "Tavsif", type: "textarea" },
      { name: "location", label: "Manzil" },
      { name: "date", label: "Sana", type: "date" },
      { name: "phone_number", label: "Telefon" },
      { name: "email", label: "Email", type: "email" },
    ],
  },
  TAXI_OWNER: {
    resource: "transportlar",
    title: "Taxi profili",
    description: "Faqat o'zingizning taxi xizmatlaringizni qo'shish, ko'rish va o'chirish mumkin.",
    fields: [
      { name: "title", label: "Nomi", required: true },
      { name: "viloyat", label: "Viloyat", type: "select", required: true },
      { name: "date", label: "Sana", type: "date" },
      { name: "phone_number", label: "Telefon" },
      { name: "email", label: "Email", type: "email" },
    ],
  },
  GUIDE: {
    resource: "gidlar",
    title: "Gid profili",
    description: "Gid sifatida faqat o'zingizning profilingizni yaratish, ko'rish va o'chirish mumkin.",
    fields: [
      { name: "title", label: "Mutaxassislik" },
      { name: "viloyat", label: "Viloyat", type: "select" },
      { name: "phone_number", label: "Telefon" },
      { name: "country", label: "Davlat" },
      { name: "language", label: "Til" },
      { name: "birthday", label: "Tug'ilgan sana", type: "date" },
    ],
    single: true,
  },
};

function buildInitialForm(fields) {
  return fields.reduce((accumulator, field) => ({ ...accumulator, [field.name]: "" }), {});
}

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [regions, setRegions] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const config = user ? resourceConfig[user.role] : null;

  useEffect(() => {
    const token = window.localStorage.getItem("visit-access-token");
    if (!token) {
      navigate("/login");
      return;
    }

    let active = true;

    async function load() {
      try {
        const [currentUser, regionsData] = await Promise.all([fetchCurrentUser(), fetchRegions()]);
        if (!active) {
          return;
        }

        setUser(currentUser);
        setRegions(Array.isArray(regionsData) ? regionsData : []);

        const currentConfig = resourceConfig[currentUser.role];
        if (!currentConfig) {
          setStatus("ready");
          return;
        }

        const owned = await fetchOwnedResources(currentConfig.resource);
        if (!active) {
          return;
        }

        const normalized = currentConfig.single ? (owned ? [owned] : []) : Array.isArray(owned) ? owned : [];
        setItems(normalized);
        setForm(buildInitialForm(currentConfig.fields));
        setStatus("ready");
      } catch (error) {
        if (!active) {
          return;
        }
        setStatus("error");
        setMessageType("error");
        setMessage(error.message || "Profil yuklanmadi.");
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!config) {
      return;
    }

    setMessage("");

    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ""));
      const created = await createOwnedResource(config.resource, payload);
      setItems((current) => (config.single ? [created] : [created, ...current]));
      setForm(buildInitialForm(config.fields));
      setMessageType("success");
      setMessage("Saqlandi.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Saqlashda xatolik.");
    }
  };

  const handleDelete = async (id) => {
    if (!config) {
      return;
    }

    try {
      await deleteOwnedResource(config.resource, id);
      setItems((current) => current.filter((item) => item.id !== id));
      setMessageType("success");
      setMessage("O'chirildi.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "O'chirishda xatolik.");
    }
  };

  return (
    <AppShell navMode="region">
      <section className="profile-page">
        <div className="profile-header">
          <p className="eyebrow">Shaxsiy kabinet</p>
          <h1>{config?.title || "Profil"}</h1>
          <p>
            {config?.description ||
              "Siz oddiy foydalanuvchisiz. Bu sahifada hozircha role asosida boshqaruv yo'q."}
          </p>
        </div>

        {status === "loading" && <p className="empty-note">Yuklanmoqda...</p>}
        {status === "error" && <p className="form-message error">{message}</p>}

        {status === "ready" && user && (
          <div className="profile-grid">
            <div className="profile-panel">
              <h2>Hisob ma'lumotlari</h2>
              <div className="facts-grid">
                <div className="fact-card">
                  <span>Username</span>
                  <strong>{user.username}</strong>
                </div>
                <div className="fact-card">
                  <span>Role</span>
                  <strong>{user.role}</strong>
                </div>
                <div className="fact-card">
                  <span>Ism</span>
                  <strong>{[user.first_name, user.last_name].filter(Boolean).join(" ") || "-"}</strong>
                </div>
                <div className="fact-card">
                  <span>Email</span>
                  <strong>{user.email || "-"}</strong>
                </div>
              </div>
            </div>

            {config && (
              <>
                <form className="profile-panel profile-form" onSubmit={handleCreate}>
                  <h2>{config.single ? "Profil yaratish" : "Yangi qo'shish"}</h2>
                  {config.single && items.length > 0 ? (
                    <p className="empty-note">Bu role uchun faqat bitta profil yaratish mumkin.</p>
                  ) : (
                    <>
                      {config.fields.map((field) => (
                        <label key={field.name}>
                          {field.label}
                          {field.type === "textarea" ? (
                            <textarea
                              name={field.name}
                              value={form[field.name] || ""}
                              onChange={handleChange}
                              required={field.required}
                            />
                          ) : field.type === "select" ? (
                            <select
                              name={field.name}
                              value={form[field.name] || ""}
                              onChange={handleChange}
                              required={field.required}
                            >
                              <option value="">Tanlang</option>
                              {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                  {region.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type || "text"}
                              name={field.name}
                              value={form[field.name] || ""}
                              onChange={handleChange}
                              required={field.required}
                            />
                          )}
                        </label>
                      ))}
                      <button type="submit" className="button button-primary">
                        Saqlash
                      </button>
                    </>
                  )}
                  {message && <p className={`form-message ${messageType}`}>{message}</p>}
                </form>

                <div className="profile-panel">
                  <h2>{config.single ? "Profilingiz" : "Sizning obyektlaringiz"}</h2>
                  {items.length > 0 ? (
                    <div className="profile-items">
                      {items.map((item) => (
                        <article className="profile-item-card" key={item.id}>
                          <div>
                            <h3>{item.title || item.username || "Profil"}</h3>
                            <p>{item.location || item.description || item.phone_number || item.language || "-"}</p>
                          </div>
                          <button type="button" className="button button-ghost small" onClick={() => handleDelete(item.id)}>
                            O'chirish
                          </button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-note">Hozircha ma'lumot yo'q.</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </AppShell>
  );
}

export default ProfilePage;
