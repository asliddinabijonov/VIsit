import { useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../api/visitApi";
import AppShell from "../components/layout/AppShell";

const initialForm = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

function RegisterPage() {
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
      setMessage("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi.");
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
          <p className="eyebrow">Join Visit Uzbekistan</p>
          <h1>Ro'yxatdan o'tish</h1>
          <h1>Ro'yxatdan o'tish</h1>
          <Link to="/" className="button button-ghost small">
            Home ga qaytish
          </Link>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Ism
            <input name="first_name" value={form.first_name} onChange={handleChange} />
          </label>
          <label>
            Familiya
            <input name="last_name" value={form.last_name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            Parol
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          <button type="submit" className="button button-primary" disabled={status === "loading"}>
            {status === "loading" ? "Yuborilmoqda..." : "Register"}
          </button>

          {message && <p className={`form-message ${status}`}>{message}</p>}
        </form>
      </section>
    </AppShell>
  );
}

export default RegisterPage;
