import { Link } from "react-router-dom";
import hero from "../assets/car8.png";
import sedan from "../assets/car6.png";
import suv from "../assets/car7.png";
import compact from "../assets/car5.png";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> A NEW CHAPTER OF DRIVING
          </p>
          <h1>
            Some things
            <br />
            are worth
            <br />
            <em>the journey.</em>
          </h1>
          <p className="hero-description">
            Your next car. Your next story. Discover a more considered way to
            buy, sell, and understand what your car is worth.
          </p>
          <div className="button-row">
            <Link className="button" to="/buy">
              Discover the collection <span>↗</span>
            </Link>
            <Link className="underlink" to="/predict">
              Value your car <span>→</span>
            </Link>
          </div>
          <div className="hero-note">
            <span className="small-seal">C</span>
            <div>
              DRIVEN BY CONFIDENCE
              <small>Thoughtful choices. Extraordinary possibilities.</small>
            </div>
          </div>
        </div>
        <div className="hero-stage">
          <div className="stage-number">EDITION / 01</div>
          <span className="stage-word">DISTINCTION</span>
          <div className="stage-circle" />
          <img
            className="hero-car"
            src={hero}
            alt="Mercedes-Benz sedan, an expression of considered automotive design"
          />
          <div className="stage-caption">
            <span>THE ART OF THE AUTOMOBILE</span>
            <p>Elegance, in every detail.</p>
          </div>
          <Link to="/buy" className="round-arrow" aria-label="Explore cars">
            ↗
          </Link>
        </div>
        <div className="hero-bottom">
          <span>
            SCROLL TO DISCOVER <span className="down-arrow">↓</span>
          </span>
          <span>BUY WITH PURPOSE. DRIVE WITH PASSION.</span>
        </div>
      </section>
      <section className="principles">
        <div>
          <span>01</span>
          <p>
            A car for every chapter<small>Explore owner-listed vehicles.</small>
          </p>
        </div>
        <div>
          <span>02</span>
          <p>
            Know your car’s worth
            <small>Data-informed, clearly explained estimates.</small>
          </p>
        </div>
        <div>
          <span>03</span>
          <p>
            Your journey, all in one place
            <small>Saved valuations. Personal listings.</small>
          </p>
        </div>
      </section>
      <section className="section collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR KIND OF EXTRAORDINARY</p>
            <h2>A drive that feels like you.</h2>
          </div>
          <Link className="underlink" to="/buy">
            Explore all cars ↗
          </Link>
        </div>
        <div className="collection-grid">
          {[
            {
              image: sedan,
              title: "Everyday elegance",
              tag: "THE SEDAN",
              search: "City",
            },
            {
              image: suv,
              title: "Beyond the familiar",
              tag: "THE SUV",
              search: "SUV",
            },
            {
              image: compact,
              title: "Made for your city",
              tag: "THE COMPACT",
              search: "Swift",
            },
          ].map((car) => (
            <Link
              key={car.tag}
              className="editorial-card"
              to={"/buy?q=" + encodeURIComponent(car.search)}
            >
              <div className="car-stage">
                <img src={car.image} alt={car.title} loading="lazy" />
              </div>
              <p className="eyebrow">{car.tag}</p>
              <h3>
                {car.title}
                <span>↗</span>
              </h3>
            </Link>
          ))}
        </div>
        <p className="caption">
          Style inspiration. Available inventory is shown in the collection.
        </p>
      </section>
      <section className="valuation-banner">
        <div className="banner-monogram" aria-hidden="true">
          C
        </div>
        <div>
          <p className="eyebrow">A LITTLE KNOWLEDGE. A BETTER DECISION.</p>
          <h2>
            Every car has a story.
            <br />
            Know what yours is worth.
          </h2>
          <p>
            Turn your vehicle’s details into an informed starting point.
            <br />
            Get an estimate and keep every valuation in your garage.
          </p>
          <Link className="button button-light" to="/predict">
            Discover your car’s value <span>↗</span>
          </Link>
        </div>
        <div className="banner-details">
          <span>01 — TELL US ABOUT YOUR CAR</span>
          <span>02 — EXPLORE YOUR ESTIMATE</span>
          <span>03 — PLAN YOUR NEXT CHAPTER</span>
        </div>
      </section>
      <section className="section closing">
        <p className="eyebrow">THE NEXT CHAPTER IS YOURS</p>
        <h2>
          Good cars deserve
          <br />
          <em>great new beginnings.</em>
        </h2>
        <Link className="underlink" to="/sell">
          Begin your selling journey ↗
        </Link>
      </section>
    </>
  );
}
