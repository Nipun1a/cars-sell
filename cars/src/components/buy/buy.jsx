import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api, { apiError, money, photoUrl } from "../../api/axios";
import { useAuth } from "../../auth";
export default function Buy() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const [query, setQuery] = useState(params.get("q") || "");
  const [data, setData] = useState({ cars: [], total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [photo, setPhoto] = useState(0);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const [retry, setRetry] = useState(0);
  const search = params.toString();
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .get("/sell?" + search)
      .then(({ data }) => {
        if (active) setData(data);
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
  }, [search, retry]);
  useEffect(() => {
    if (!selected) return;
    const close = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
    };
  }, [selected]);
  function filter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }
  async function inquire(event) {
    event.preventDefault();
    setSending(true);
    setNotice("");
    try {
      await api.post("/inquiries", { listing: selected._id, message });
      setNotice(
        "Your enquiry is saved. The seller can see your message and email in their garage.",
      );
      setMessage("");
    } catch (err) {
      setNotice(apiError(err));
    } finally {
      setSending(false);
    }
  }
  return (
    <section className="section">
      <div className="page-heading">
        <p className="eyebrow">THE COLLECTION</p>
        <h1>
          Find your next
          <br />
          <em>great beginning.</em>
        </h1>
        <p>
          Explore cars listed by their owners. A new chapter starts with a
          closer look.
        </p>
      </div>
      <div className="inventory-filters">
        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            filter("q", query);
          }}
        >
          <label className="sr-only" htmlFor="search">
            Search cars
          </label>
          <input
            id="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a make or model"
          />
          <button aria-label="Search cars">Search ↗</button>
        </form>
        <select
          aria-label="Filter by fuel"
          value={params.get("fuel") || ""}
          onChange={(event) => filter("fuel", event.target.value)}
        >
          <option value="">All fuel types</option>
          {["Petrol", "Diesel", "CNG", "LPG", "Electric"].map((fuel) => (
            <option key={fuel}>{fuel}</option>
          ))}
        </select>
        <select
          aria-label="Sort listings"
          value={params.get("sort") || ""}
          onChange={(event) => filter("sort", event.target.value)}
        >
          <option value="">Most recent</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>
      <div className="results-heading">
        <span>
          {loading
            ? "Discovering the collection…"
            : data.total + " vehicles in the collection"}
        </span>
        <Link to="/sell" className="underlink">
          List your car ↗
        </Link>
      </div>
      {error ? (
        <div className="empty-state">
          <h2>The collection is taking a moment.</h2>
          <p className="error" role="alert">
            {error}
          </p>
          <button className="button" onClick={() => setRetry(retry + 1)}>
            Try again ↗
          </button>
        </div>
      ) : loading ? (
        <div
          className="inventory-grid"
          aria-label="Loading listings"
          aria-busy="true"
        >
          {[1, 2, 3].map((key) => (
            <div key={key} className="skeleton" />
          ))}
        </div>
      ) : data.cars.length ? (
        <>
          <div className="inventory-grid">
            {data.cars.map((car) => (
              <article key={car._id} className="listing-card">
                <button
                  className="listing-image"
                  onClick={() => {
                    setSelected(car);
                    setPhoto(0);
                    setNotice("");
                    setMessage("");
                  }}
                  aria-label={"View " + car.car_name}
                >
                  {car.photos?.length ? (
                    <img
                      src={photoUrl(car.photos[0])}
                      alt={car.car_name}
                      loading="lazy"
                    />
                  ) : (
                    <span>CARLO COLLECTION</span>
                  )}
                  <span className="listing-year">{car.model}</span>
                </button>
                <div className="listing-content">
                  <p className="eyebrow">{car.city || "OWNER LISTED"}</p>
                  <h2>{car.car_name}</h2>
                  <p className="car-meta">
                    {car.kms_driven?.toLocaleString("en-IN")} km <span>·</span>{" "}
                    {car.fuel_type} <span>·</span> {car.transmission}
                  </p>
                  <div className="listing-bottom">
                    <strong>{money(car.price)}</strong>
                    <button
                      className="underlink"
                      onClick={() => {
                        setSelected(car);
                        setPhoto(0);
                        setNotice("");
                        setMessage("");
                      }}
                    >
                      Explore ↗
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="pagination">
            <button
              disabled={Number(params.get("page") || 1) <= 1}
              onClick={() =>
                filter("page", String(Number(params.get("page") || 1) - 1))
              }
            >
              ← Previous
            </button>
            <span>
              Page {params.get("page") || 1} of {Math.max(1, data.pages)}
            </span>
            <button
              disabled={Number(params.get("page") || 1) >= data.pages}
              onClick={() =>
                filter("page", String(Number(params.get("page") || 1) + 1))
              }
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p className="eyebrow">ROOM FOR SOMETHING SPECIAL</p>
          <h2>
            {search
              ? "Your next car is worth the wait."
              : "The collection starts with you."}
          </h2>
          <p>
            {search
              ? "Try a different make or remove your filters."
              : "Be among the first to list a car in the CarLo collection."}
          </p>
          {search ? (
            <button
              className="button"
              onClick={() => {
                setParams({});
                setQuery("");
              }}
            >
              Clear filters ↗
            </button>
          ) : (
            <Link className="button" to="/sell">
              List your car ↗
            </Link>
          )}
        </div>
      )}
      {selected && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div
            className="car-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="car-title"
          >
            <button
              className="modal-close"
              autoFocus
              onClick={() => setSelected(null)}
            >
              Close ×
            </button>
            <img
              className="detail-image"
              src={photoUrl(selected.photos[photo])}
              alt={selected.car_name}
            />
            <div className="thumbnails">
              {selected.photos.map((path, index) => (
                <button
                  key={path}
                  onClick={() => setPhoto(index)}
                  aria-label={"Photo " + (index + 1)}
                  aria-pressed={photo === index}
                >
                  <img src={photoUrl(path)} alt="" />
                </button>
              ))}
            </div>
            <p className="eyebrow">
              {selected.city} / {selected.model}
            </p>
            <h2 id="car-title">{selected.car_name}</h2>
            <p className="result-price">{money(selected.price)}</p>
            <p>
              {selected.kms_driven?.toLocaleString("en-IN")} km ·{" "}
              {selected.fuel_type} · {selected.transmission}
            </p>
            <p className="description">
              {selected.description ||
                "Contact the seller to learn more about this vehicle."}
            </p>
            <hr />
            {user ? (
              <form onSubmit={inquire}>
                <label>
                  Ask the seller
                  <textarea
                    required
                    minLength={10}
                    maxLength={1000}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Ask about service history, condition, or arranging a viewing."
                  />
                </label>
                <p className="fine-print">
                  Sending an enquiry shares your account name and email with
                  this seller so they can respond directly.
                </p>
                <button className="button" disabled={sending}>
                  {sending ? "Saving…" : "Send enquiry ↗"}
                </button>
              </form>
            ) : (
              <Link className="button" to="/login">
                Sign in to enquire ↗
              </Link>
            )}
            {notice && (
              <p role="status" className="notice">
                {notice}
              </p>
            )}
            <p className="fine-print">
              Owner supplied listing. Arrange an independent inspection and
              verify ownership before any payment.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
