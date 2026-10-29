import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError, money } from "../api/axios";
import { useAuth } from "../auth";
export default function CarPricePredictor() {
  const { user, loading } = useAuth();
  const [options, setOptions] = useState(null);
  const [form, setForm] = useState({
    name: "",
    year: "",
    kms_driven: "",
    fuel_type: "Petrol",
    seller_type: "Individual",
    transmission: "Manual",
    owner: "First Owner",
    mileage: "",
    engine: "",
    max_power: "",
    seats: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    api
      .get("/valuation-options")
      .then(({ data }) => {
        if (active) {
          setOptions(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(apiError(err));
      });
    return () => {
      active = false;
    };
  }, [retry]);
  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setResult(null);
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const { data } = await api.post("/predict-price", form);
      setResult(data.valuation);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="section">
      <div className="page-heading">
        <p className="eyebrow">KNOW YOUR CAR. KNOW YOUR NEXT MOVE.</p>
        <h1>
          A value.
          <br />
          <em>A new possibility.</em>
        </h1>
        <p>
          A data-informed starting point for your selling journey, saved to your
          personal garage.
        </p>
      </div>
      <div className="valuation-layout">
        <form className="form-panel" onSubmit={submit}>
          <div className="panel-title">
            <span className="step">01</span>
            <div>
              <h2>The details make the difference.</h2>
              <p>Tell us a little about your car.</p>
            </div>
          </div>
          {error && (
            <div className="error" role="alert">
              {error}
              {!options && (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setRetry(retry + 1)}
                >
                  Try again
                </button>
              )}
            </div>
          )}
          <div className="form-grid">
            <label className="span-2">
              Vehicle model
              <input
                list="vehicle-models"
                name="name"
                value={form.name}
                onChange={change}
                required
                placeholder={
                  options
                    ? "Type to find your exact model"
                    : "Loading supported models…"
                }
                disabled={!options}
              />
              <datalist id="vehicle-models">
                {options?.models.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </label>
            <label>
              Registration year
              <input
                type="number"
                name="year"
                min="1980"
                max={new Date().getFullYear()}
                value={form.year}
                onChange={change}
                required
                placeholder="e.g. 2017"
              />
            </label>
            <label>
              Distance driven (km)
              <input
                type="number"
                name="kms_driven"
                min="0"
                max="2000000"
                value={form.kms_driven}
                onChange={change}
                required
                placeholder="e.g. 45000"
              />
            </label>
            {[
              ["fuel_type", "Fuel type"],
              ["transmission", "Transmission"],
              ["owner", "Ownership"],
              ["seller_type", "Seller type"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <select name={key} value={form[key]} onChange={change}>
                  {(options?.categories[key] || [form[key]]).map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <details className="specifications">
            <summary>
              Add vehicle specifications <span>Recommended +</span>
            </summary>
            <div className="form-grid">
              {[
                ["engine", "Engine (cc)", 300, 8000],
                ["mileage", "Mileage (km/l or km/kg)", 1, 60],
                ["max_power", "Power (bhp)", 10, 1500],
                ["seats", "Seats", 2, 14],
              ].map(([key, label, min, max]) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    name={key}
                    min={min}
                    max={max}
                    step={key === "seats" ? "1" : "any"}
                    value={form[key]}
                    onChange={change}
                    placeholder="Optional"
                  />
                </label>
              ))}
            </div>
          </details>
          {user ? (
            <button className="button full-width" disabled={busy || !options}>
              {busy ? "Calculating & saving…" : "Discover my car’s value ↗"}
            </button>
          ) : (
            <Link
              className="button full-width"
              to="/login"
              state={{ from: "/predict" }}
            >
              {loading ? "Checking your account…" : "Sign in to value & save ↗"}
            </Link>
          )}
          <p className="fine-print">
            All estimates are in Indian rupees (INR). Successful valuations are
            automatically saved to your account.
          </p>
        </form>
        <aside className="valuation-aside" aria-live="polite">
          {result ? (
            <>
              <p className="eyebrow">YOUR CAR, CONSIDERED</p>
              <h2>{result.inputs.name}</h2>
              <p className="result-price">{money(result.predicted_price)}</p>
              <p>Estimated selling value</p>
              <div className="price-range">
                <small>INDICATIVE RANGE</small>
                <strong>
                  {money(result.price_range.lower)} –{" "}
                  {money(result.price_range.upper)}
                </strong>
              </div>
              <p className="saved-note">✓ Saved to your garage</p>
              <Link className="underlink" to="/account">
                View valuation history ↗
              </Link>
              {result.warnings.map((warning) => (
                <p className="fine-print" key={warning}>
                  {warning}
                </p>
              ))}
            </>
          ) : (
            <>
              <span className="outline-mark">C</span>
              <p className="eyebrow">CLARITY BEFORE YOUR NEXT CHAPTER</p>
              <h2>
                Confidence begins
                <br />
                with understanding.
              </h2>
              <p>
                Your estimate brings together vehicle age, mileage,
                specifications and comparable historical listings.
              </p>
              <div className="aside-rule" />
              <p className="fine-print">
                The model uses a historical 2020 dataset. Estimates are
                indicative and do not reflect live market changes, vehicle
                condition or location. A physical appraisal is recommended
                before a sale.
              </p>
              {options && (
                <p className="fine-print">
                  Held-out median percentage error:{" "}
                  {options.test.median_absolute_percentage_error}%. This
                  describes the historical test set, not a guarantee for your
                  car.
                </p>
              )}
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
