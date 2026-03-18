import { useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../api/visitApi";
import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";

const initialForm = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

function RegisterPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await createUser(form);
      setStatus("success");
      setMessage(t("register.success"));
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  return (
    <AppShell navMode="region">
      <section className="register-page">
        <div className="register-copy">
          <p className="eyebrow">{t("register.eyebrow")}</p>
          <h1>{t("register.title")}</h1>
          <Link to="/" className="button button-ghost small">
            {t("register.backHome")}
          </Link>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            {t("register.username")}
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            {t("register.firstName")}
            <input name="first_name" value={form.first_name} onChange={handleChange} />
          </label>
          <label>
            {t("register.lastName")}
            <input name="last_name" value={form.last_name} onChange={handleChange} />
          </label>
          <label>
            {t("register.email")}
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            {t("register.password")}
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          <button type="submit" className="button button-primary" disabled={status === "loading"}>
            {status === "loading" ? t("register.submitting") : t("register.submit")}
          </button>

          {message && <p className={`form-message ${status}`}>{message}</p>}
        </form>
      </section>
    </AppShell>
  );
}

export default RegisterPage;
