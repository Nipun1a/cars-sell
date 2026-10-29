import { useState, useEffect } from "react";
import api from "./api/axios";
import { AuthContext } from "./auth";
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api
      .get("/auth/me")
      .then(({ data }) => {
        if (active) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    // Discard the old untrusted local-storage session.
    localStorage.removeItem("user");
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          !error.config.url.includes("/auth/login")
        )
          setUser(null);
        return Promise.reject(error);
      },
    );
    return () => {
      active = false;
      api.interceptors.response.eject(interceptor);
    };
  }, []);
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
