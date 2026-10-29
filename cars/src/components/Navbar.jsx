import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { apiError } from "../api/axios";
export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function signOut() {
    try {
      await logout();
      setOpen(false);
      navigate("/");
    } catch (err) {
      setError(apiError(err));
    }
  }
  return (
    <>
      <div className="announcement">
        A considered way to buy, sell & value your car{" "}
        <span>THE CARLO EXPERIENCE</span>
      </div>
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="CarLo home">
          <span className="brand-symbol">C</span>CARLO
          <span className="wordmark-caption">EXCEPTIONAL DRIVES</span>
        </Link>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close −" : "Menu +"}
        </button>
        <nav
          className={open ? "navigation open" : "navigation"}
          aria-label="Main navigation"
        >
          <NavLink onClick={() => setOpen(false)} to="/buy">
            Explore cars
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/sell">
            Sell your car
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/predict">
            Car valuation
          </NavLink>
          <span className="nav-divider" />
          {user ? (
            <>
              <NavLink onClick={() => setOpen(false)} to="/account">
                My garage
              </NavLink>
              <button className="text-button" onClick={signOut}>
                Sign out ↗
              </button>
            </>
          ) : (
            <NavLink
              className="nav-account"
              onClick={() => setOpen(false)}
              to="/login"
            >
              Your account <span>↗</span>
            </NavLink>
          )}
        </nav>
      </header>
      {error && (
        <div role="alert" className="error global-error">
          {error}
        </div>
      )}
    </>
  );
}
