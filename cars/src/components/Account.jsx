import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import api, { apiError, money, photoUrl } from "../api/axios";
export default function Account() {
  const { user } = useAuth();
  const [tab, setTab] = useState("valuations");
  const [data, setData] = useState({ valuations: [], cars: [], inquiries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/valuations"),
      api.get("/sell/mine"),
      api.get("/inquiries"),
    ])
      .then(([valuations, cars, inquiries]) => {
        if (active)
          setData({ ...valuations.data, ...cars.data, ...inquiries.data });
      })
      .catch((err) => {
        if (active) setError(apiError(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refresh]);
  async function remove(id) {
    setBusy(true);
    setError("");
    try {
      await api.delete("/sell/" + id);
      setRemoving(null);
      setRefresh(refresh + 1);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }
  async function changePassword(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (password.newPassword !== password.confirm)
      return setError("The new passwords do not match.");
    setBusy(true);
    try {
      const { data } = await api.post("/auth/password", {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setNotice(data.message);
      setPassword({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="section">
      <div className="page-heading">
        <p className="eyebrow">YOUR PERSONAL GARAGE</p>
        <h1>
          Welcome, <em>{user.username}.</em>
        </h1>
        <p>Your cars, your valuations, your next chapter.</p>
      </div>
      <div className="account-tabs" role="tablist">
        {[
          ["valuations", "Valuations"],
          ["cars", "My listings"],
          ["inquiries", "Buyer enquiries"],
          ["settings", "Account"],
        ].map(([key, title]) => (
          <button
            role="tab"
            aria-selected={tab === key}
            key={key}
            onClick={() => {
              setTab(key);
              setNotice("");
              setError("");
            }}
          >
            {title}
            {key !== "settings" && <span>{data[key].length}</span>}
          </button>
        ))}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
          <button
            className="text-button"
            onClick={() => setRefresh(refresh + 1)}
          >
            Retry
          </button>
        </p>
      )}
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
      {tab !== "settings" && loading ? (
        <div className="page-loading">Opening your garage…</div>
      ) : tab === "valuations" ? (
        data.valuations.length ? (
          <div className="history-list">
            {data.valuations.map((value) => (
              <article className="history-row" key={value._id}>
                <div>
                  <p className="eyebrow">
                    {new Date(value.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h3>{value.inputs.name}</h3>
                  <p>
                    {value.inputs.year} ·{" "}
                    {value.inputs.kms_driven.toLocaleString("en-IN")} km ·{" "}
                    {value.inputs.fuel_type}
                  </p>
                  <p className="fine-print">
                    Model {value.model_version} · Historical estimate
                  </p>
                  <details>
                    <summary>Valuation details</summary>
                    <p>
                      Range: {money(value.price_range.lower)} –{" "}
                      {money(value.price_range.upper)}
                    </p>
                    {value.warnings.map((text) => (
                      <p className="fine-print" key={text}>
                        {text}
                      </p>
                    ))}
                  </details>
                </div>
                <strong>{money(value.predicted_price)}</strong>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>A little clarity for the road ahead.</h2>
            <p>Your saved car valuations will appear here.</p>
            <Link className="button" to="/predict">
              Value your car ↗
            </Link>
          </div>
        )
      ) : tab === "cars" ? (
        data.cars.length ? (
          <div className="history-list">
            {data.cars.map((car) => (
              <article className="history-row" key={car._id}>
                <img
                  className="garage-photo"
                  src={photoUrl(car.photos[0])}
                  alt={car.car_name}
                />
                <div className="history-info">
                  <h3>{car.car_name}</h3>
                  <p>
                    {car.model} · {car.city}
                  </p>
                  <strong>{money(car.price)}</strong>
                </div>
                {removing === car._id ? (
                  <div>
                    <p>Remove this listing?</p>
                    <button
                      className="danger-button"
                      disabled={busy}
                      onClick={() => remove(car._id)}
                    >
                      Confirm removal
                    </button>
                    <button
                      className="text-button"
                      onClick={() => setRemoving(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-button"
                    onClick={() => setRemoving(car._id)}
                  >
                    Remove listing ×
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Make room for your next chapter.</h2>
            <p>Your active listings will appear here.</p>
            <Link className="button" to="/sell">
              List your car ↗
            </Link>
          </div>
        )
      ) : tab === "inquiries" ? (
        data.inquiries.length ? (
          <div className="history-list">
            {data.inquiries.map((item) => (
              <article className="history-row" key={item._id}>
                <div>
                  <p className="eyebrow">
                    {item.listing?.car_name || "Removed listing"} /{" "}
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </p>
                  <h3>{item.buyer?.username || "Buyer"}</h3>
                  <p className="description">{item.message}</p>
                  <a className="underlink" href={"mailto:" + item.buyer.email}>
                    {item.buyer.email} ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Good conversations start here.</h2>
            <p>Buyer enquiries about your listings will appear here.</p>
          </div>
        )
      ) : (
        <div className="form-panel account-settings">
          <p className="eyebrow">ACCOUNT DETAILS</p>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <hr />
          <h3>Change your password</h3>
          <form onSubmit={changePassword}>
            {[
              ["currentPassword", "Current password"],
              ["newPassword", "New password"],
              ["confirm", "Confirm new password"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  type="password"
                  value={password[key]}
                  onChange={(event) =>
                    setPassword({ ...password, [key]: event.target.value })
                  }
                  autoComplete={
                    key === "currentPassword"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                  minLength={key === "currentPassword" ? 1 : 10}
                  maxLength={72}
                />
              </label>
            ))}
            <button className="button" disabled={busy}>
              {busy ? "Updating…" : "Update password ↗"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
