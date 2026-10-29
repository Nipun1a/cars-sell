import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api, { apiError } from "../../api/axios";
export default function PasswordRecovery({ reset = false }) {
  const location = useLocation();
  const token = new URLSearchParams(location.hash.slice(1)).get("token") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (reset && password !== confirm)
      return setError("Your passwords do not match.");
    setBusy(true);
    try {
      const { data } = await api.post(
        "/auth/" + (reset ? "reset-password" : "forgot-password"),
        reset ? { token, password } : { email },
      );
      setNotice(data.message);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="section recovery-layout">
      <div className="page-heading">
        <p className="eyebrow">BACK TO YOUR JOURNEY</p>
        <h1>{reset ? "A fresh start." : "Let’s get you back in."}</h1>
        <p>
          {reset
            ? "Choose a new password for your CarLo account."
            : "Enter your account email to request a secure reset link."}
        </p>
      </div>
      <form className="form-panel" onSubmit={submit}>
        {reset ? (
          <>
            <label>
              New password
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                maxLength={72}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 10 characters"
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
            </label>
          </>
        ) : (
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
        {!(notice && reset) && (
          <button
            className="button full-width"
            disabled={busy || (reset && !token)}
          >
            {busy
              ? "One moment…"
              : reset
                ? "Reset password ↗"
                : "Send reset link ↗"}
          </button>
        )}
        {reset && !token && (
          <p className="error">
            This reset link is incomplete. Request a new link.
          </p>
        )}
        <Link
          className="underlink"
          to={reset && !token ? "/forgot-password" : "/login"}
        >
          {reset && !token ? "Request a reset link" : "Back to sign in"} ↗
        </Link>
      </form>
    </section>
  );
}
