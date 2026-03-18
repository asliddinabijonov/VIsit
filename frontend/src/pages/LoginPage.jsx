import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/visitApi";
import AppShell from "../components/layout/AppShell";
import { useLanguage } from "../i18n/LanguageContext";

const initialForm = {
  username: "",
  password: "",
};

const loginCopy = {
  uz: {
    eyebrow: "Qayta xush kelibsiz",
    title: "Hisobingizga kiring",
    subtitle: "Sayohat rejalari, saqlangan joylar va 360 tajribalarni davom ettiring.",
    submit: "Kirish",
    loading: "Tekshirilmoqda...",
    success: "Muvaffaqiyatli kirildi.",
    username: "Username",
    password: "Parol",
    backHome: "Bosh sahifaga qaytish",
    createAccount: "Yangi hisob yaratish",
    invalid: "Login yoki parol noto'g'ri.",
    cardTitle: "Nima ochiladi",
    cardBody: "Saqlangan marshrutlar, tarixiy obidalar va immersive media bitta joyda bo'ladi.",
  },
  en: {
    eyebrow: "Welcome back",
    title: "Sign in to your account",
    subtitle: "Continue your trip plans, saved places, and 360 experiences.",
    submit: "Sign In",
    loading: "Checking...",
    success: "Signed in successfully.",
    username: "Username",
    password: "Password",
    backHome: "Back to home",
    createAccount: "Create account",
    invalid: "Invalid username or password.",
    cardTitle: "What opens up",
    cardBody: "Saved routes, historic landmarks, and immersive media stay in one place.",
  },
  ru: {
    eyebrow: "С возвращением",
    title: "Войдите в аккаунт",
    subtitle: "Продолжайте планы поездки, сохраненные места и 360-впечатления.",
    submit: "Войти",
    loading: "Проверка...",
    success: "Вход выполнен успешно.",
    username: "Имя пользователя",
    password: "Пароль",
    backHome: "На главную",
    createAccount: "Создать аккаунт",
    invalid: "Неверный логин или пароль.",
    cardTitle: "Что доступно",
    cardBody: "Сохраненные маршруты, исторические места и immersive media в одном месте.",
  },
  ar: {
    eyebrow: "مرحبًا بعودتك",
    title: "سجّل الدخول إلى حسابك",
    subtitle: "تابع خطط رحلتك والأماكن المحفوظة وتجارب 360.",
    submit: "تسجيل الدخول",
    loading: "جارٍ التحقق...",
    success: "تم تسجيل الدخول بنجاح.",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    backHome: "العودة للرئيسية",
    createAccount: "إنشاء حساب",
    invalid: "اسم المستخدم أو كلمة المرور غير صحيحة.",
    cardTitle: "ما الذي ستحصل عليه",
    cardBody: "المسارات المحفوظة والمعالم التاريخية والوسائط التفاعلية في مكان واحد.",
  },
  zh: {
    eyebrow: "欢迎回来",
    title: "登录你的账户",
    subtitle: "继续你的行程计划、已保存地点和 360 体验。",
    submit: "登录",
    loading: "验证中...",
    success: "登录成功。",
    username: "用户名",
    password: "密码",
    backHome: "返回首页",
    createAccount: "创建账户",
    invalid: "用户名或密码错误。",
    cardTitle: "可获得内容",
    cardBody: "保存的路线、历史景点和沉浸式媒体集中在一个地方。",
  },
  es: {
    eyebrow: "Bienvenido de nuevo",
    title: "Inicia sesión en tu cuenta",
    subtitle: "Continúa tus planes de viaje, lugares guardados y experiencias 360.",
    submit: "Iniciar sesión",
    loading: "Verificando...",
    success: "Inicio de sesión exitoso.",
    username: "Usuario",
    password: "Contraseña",
    backHome: "Volver al inicio",
    createAccount: "Crear cuenta",
    invalid: "Usuario o contraseña incorrectos.",
    cardTitle: "Qué obtienes",
    cardBody: "Rutas guardadas, monumentos históricos y medios inmersivos en un solo lugar.",
  },
  fr: {
    eyebrow: "Bon retour",
    title: "Connectez-vous à votre compte",
    subtitle: "Poursuivez vos plans de voyage, lieux enregistrés et expériences 360.",
    submit: "Connexion",
    loading: "Vérification...",
    success: "Connexion réussie.",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    backHome: "Retour à l'accueil",
    createAccount: "Créer un compte",
    invalid: "Identifiant ou mot de passe invalide.",
    cardTitle: "Ce que vous obtenez",
    cardBody: "Itinéraires enregistrés, monuments historiques et médias immersifs réunis.",
  },
  de: {
    eyebrow: "Willkommen zurück",
    title: "Melde dich in deinem Konto an",
    subtitle: "Setze deine Reisepläne, gespeicherten Orte und 360-Erlebnisse fort.",
    submit: "Anmelden",
    loading: "Wird geprüft...",
    success: "Erfolgreich angemeldet.",
    username: "Benutzername",
    password: "Passwort",
    backHome: "Zur Startseite",
    createAccount: "Konto erstellen",
    invalid: "Benutzername oder Passwort ist falsch.",
    cardTitle: "Was dich erwartet",
    cardBody: "Gespeicherte Routen, historische Orte und immersive Medien an einem Ort.",
  },
};

function LoginPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = loginCopy[language] || loginCopy.uz;
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
      const data = await loginUser(form);
      window.localStorage.setItem("visit-access-token", data.access);
      window.localStorage.setItem("visit-refresh-token", data.refresh);
      window.localStorage.setItem("visit-auth-username", form.username);
      window.dispatchEvent(new Event("visit-auth-changed"));
      setStatus("success");
      setMessage(copy.success);
      window.setTimeout(() => navigate("/"), 500);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || copy.invalid);
    }
  }

  return (
    <AppShell navMode="region">
      <section className="login-page">
        <div className="login-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
          <div className="login-copy-card">
            <strong>{copy.cardTitle}</strong>
            <span>{copy.cardBody}</span>
          </div>
          <div className="login-links">
            <Link to="/" className="button button-ghost small">
              {copy.backHome}
            </Link>
            <Link to="/register" className="button button-dark small">
              {copy.createAccount}
            </Link>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            {copy.username}
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            {copy.password}
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <button type="submit" className="button button-primary" disabled={status === "loading"}>
            {status === "loading" ? copy.loading : copy.submit}
          </button>
          {message && <p className={`form-message ${status}`}>{message}</p>}
        </form>
      </section>
    </AppShell>
  );
}

export default LoginPage;
