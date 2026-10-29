import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../../api/axios";
export default function Sell() {
  const [form, setForm] = useState({
    car_name: "",
    model: "",
    price: "",
    kms_driven: "",
    fuel_type: "Petrol",
    transmission: "Manual",
    city: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);
  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  function photos(event) {
    const files = Array.from(event.target.files);
    if (
      files.length > 5 ||
      files.some(
        (file) =>
          file.size > 5 * 1024 * 1024 ||
          !["image/jpeg", "image/png", "image/webp"].includes(file.type),
      )
    ) {
      setError("Choose up to 5 JPG, PNG or WebP photos, each under 5 MB.");
      event.target.value = "";
      setImages([]);
      return;
    }
    setImages(files);
    setError("");
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      images.forEach((file) => data.append("photos", file));
      await api.post("/sell", data);
      setSuccess(true);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <section className="section closing">
        <p className="eyebrow">A NEW CHAPTER BEGINS</p>
        <h1>
          Your car.
          <br />
          <em>Now in the collection.</em>
        </h1>
        <p>
          Your listing has been saved. Manage it and read buyer enquiries in
          your garage.
        </p>
        <div className="button-row">
          <Link className="button" to="/account">
            Open my garage ↗
          </Link>
          <Link className="underlink" to="/buy">
            Explore the collection →
          </Link>
        </div>
      </section>
    );
  return (
    <section className="section">
      <div className="page-heading">
        <p className="eyebrow">PASS ON THE POSSIBILITY</p>
        <h1>
          Great journeys
          <br />
          <em>deserve another chapter.</em>
        </h1>
        <p>Create your listing. Tell your story. Find your car’s next owner.</p>
      </div>
      <div className="valuation-layout">
        <form className="form-panel" onSubmit={submit}>
          <div className="panel-title">
            <span className="step">01</span>
            <div>
              <h2>Introduce your car.</h2>
              <p>The right details help the right buyer find you.</p>
            </div>
          </div>
          <div className="form-grid">
            <label className="span-2">
              Make, model & variant
              <input
                name="car_name"
                value={form.car_name}
                onChange={update}
                required
                maxLength={120}
                placeholder="e.g. Honda City V i-VTEC"
              />
            </label>
            {[
              [
                "model",
                "Registration year",
                1980,
                new Date().getFullYear(),
                "2017",
              ],
              ["price", "Asking price (₹)", 10000, 100000000, "650000"],
              ["kms_driven", "Distance driven (km)", 0, 2000000, "45000"],
            ].map(([key, label, min, max, placeholder]) => (
              <label key={key}>
                {label}
                <input
                  name={key}
                  type="number"
                  value={form[key]}
                  onChange={update}
                  min={min}
                  max={max}
                  required
                  placeholder={placeholder}
                />
              </label>
            ))}
            <label>
              City
              <input
                name="city"
                value={form.city}
                onChange={update}
                required
                maxLength={80}
                placeholder="e.g. Mumbai"
              />
            </label>
            <label>
              Fuel type
              <select name="fuel_type" value={form.fuel_type} onChange={update}>
                {["Petrol", "Diesel", "CNG", "LPG", "Electric"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Transmission
              <select
                name="transmission"
                value={form.transmission}
                onChange={update}
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </label>
            <label className="span-2">
              The story so far
              <textarea
                name="description"
                value={form.description}
                onChange={update}
                maxLength={2000}
                rows={5}
                placeholder="Tell buyers about its condition, service history, ownership and what makes it special."
              />
            </label>
            <label className="span-2 upload-zone">
              A closer look
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={photos}
              />
              <small>Up to 5 photos · JPG, PNG, WebP · 5 MB each</small>
            </label>
            {previews.length > 0 && (
              <div className="photo-previews span-2">
                {previews.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={"Vehicle preview " + (index + 1)}
                  />
                ))}
              </div>
            )}
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="button full-width" disabled={busy}>
            {busy ? "Saving your listing…" : "Publish my listing ↗"}
          </button>
          <p className="fine-print">
            Your listing becomes visible in the collection. Buyers can send
            enquiries; your email is not displayed publicly.
          </p>
        </form>
        <aside className="valuation-aside">
          <p className="eyebrow">A CONSIDERED FIRST IMPRESSION</p>
          <h2>
            Every detail
            <br />
            tells a story.
          </h2>
          <ol className="selling-tips">
            <li>
              Photograph in natural light.
              <p>Include the exterior, cabin and any wear.</p>
            </li>
            <li>
              Be open about the history.
              <p>Service records and honest details build confidence.</p>
            </li>
            <li>
              Start with an informed price.
              <p>A valuation gives you a useful starting point.</p>
            </li>
          </ol>
          <Link className="underlink" to="/predict">
            Get a car valuation ↗
          </Link>
        </aside>
      </div>
    </section>
  );
}
