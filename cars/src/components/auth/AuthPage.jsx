import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import api, { apiError } from "../../api/axios";
import { useAuth } from "../../auth";
import car from "../../assets/car8.png";
export default function AuthPage({ register = false }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const destination = ["/sell", "/account", "/predict"].includes(
    location.state?.from,
  )
    ? location.state.from
    : "/account";
  if (user) return <Navigate to={destination} replace />;
  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    if (register && form.password !== form.confirm)
      return setError("Your passwords do not match.");
    setBusy(true);
    try {
      const { data } = await api.post(
        "/auth/" + (register ? "register" : "login"),
        { username: form.username, email: form.email, password: form.password },
      );
      setUser(data.user);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-layout">
      <div className="auth-editorial">
        <p className="eyebrow">THE CARLO EXPERIENCE</p>
        <h2>
          A new journey.
          <br />
          <em>A familiar feeling.</em>
        </h2>
        <img src={car} alt="A refined Mercedes-Benz sedan" />
        <p>
          A place for your cars, your valuations,
          <br />
          and everything that comes next.
        </p>
      </div>
      <div className="auth-form">
        <p className="eyebrow">YOUR PERSONAL GARAGE</p>
        <h1>{register ? "Begin your journey." : "Welcome back."}</h1>
        <p>
          {register
            ? "Create an account to save valuations and list your car."
            : "Sign in to pick up where you left off."}
        </p>
        <form onSubmit={submit}>
          {register && (
            <label>
              Your name
              <input
                name="username"
                value={form.username}
                onChange={update}
                required
                minLength={2}
                maxLength={60}
                autoComplete="name"
                placeholder="Full name"
              />
            </label>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <div className="password-field">
              <input
                name="password"
                type={show ? "text" : "password"}
                value={form.password}
                onChange={update}
                required
                minLength={register ? 10 : 1}
                maxLength={72}
                autoComplete={register ? "new-password" : "current-password"}
                placeholder={
                  register ? "At least 10 characters" : "Enter your password"
                }
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          {register && (
            <label>
              Confirm password
              <input
                name="confirm"
                type={show ? "text" : "password"}
                value={form.confirm}
                onChange={update}
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
              />
            </label>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {!register && (
            <Link className="forgot-link" to="/forgot-password">
              Forgot your password?
            </Link>
          )}
          <button className="button full-width" disabled={busy}>
            {busy
              ? "One moment…"
              : register
                ? "Create your account ↗"
                : "Sign in ↗"}
          </button>
        </form>
        <p className="auth-switch">
          {register ? "Already part of CarLo?" : "New to CarLo?"}{" "}
          <Link to={register ? "/login" : "/register"} state={location.state}>
            {register ? "Sign in" : "Create an account"}
          </Link>
        </p>
        <p className="fine-print">
          Your personal garage keeps your listings and valuation history
          together, wherever the road takes you.
        </p>
      </div>
    </section>
  );
}
