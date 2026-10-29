import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import AuthProvider from "./AuthProvider";
import { useAuth } from "./auth";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
const Buy = lazy(() => import("./components/buy/buy"));
const Sell = lazy(() => import("./components/sell/sell"));
const CarPricePredictor = lazy(() => import("./components/CarPricePredictor"));
const AuthPage = lazy(() => import("./components/auth/AuthPage"));
const Account = lazy(() => import("./components/Account"));
const PasswordRecovery = lazy(
  () => import("./components/auth/PasswordRecovery"),
);
function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <div className="page-loading" role="status">
        Opening your garage…
      </div>
    );
  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-wordmark" to="/">
          CARLO
        </Link>
        <p>For the love of the journey.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link to="/buy">Explore cars</Link>
        <Link to="/sell">Sell your car</Link>
        <Link to="/predict">Car valuation</Link>
        <Link to="/account">My garage</Link>
      </nav>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} CarLo. All rights reserved.</span>
        <span>CRAFTED FOR THE ROAD AHEAD</span>
      </div>
    </footer>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Suspense
            fallback={
              <div className="page-loading">Preparing your journey…</div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buy" element={<Buy />} />
              <Route
                path="/sell"
                element={
                  <Protected>
                    <Sell />
                  </Protected>
                }
              />
              <Route path="/predict" element={<CarPricePredictor />} />
              <Route path="/login" element={<AuthPage key="login" />} />
              <Route
                path="/register"
                element={<AuthPage key="register" register />}
              />
              <Route
                path="/account"
                element={
                  <Protected>
                    <Account />
                  </Protected>
                }
              />
              <Route
                path="/forgot-password"
                element={<PasswordRecovery key="forgot" />}
              />
              <Route
                path="/reset-password"
                element={<PasswordRecovery key="reset" reset />}
              />
              <Route
                path="*"
                element={
                  <section className="section closing">
                    <p className="eyebrow">404 / A DIFFERENT ROAD</p>
                    <h1>
                      Let’s get you
                      <br />
                      back on track.
                    </h1>
                    <Link className="button" to="/">
                      Return home ↗
                    </Link>
                  </section>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
