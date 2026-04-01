import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "pl_auth_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setAuthLoading(false);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const register = async (payload) => {
    await API.post("/auth/register", payload);
    return login({
      identifier: payload.email,
      password: payload.password,
    });
  };

  const login = async ({ identifier, password }) => {
    const body = new URLSearchParams();
    body.append("username", identifier);
    body.append("password", password);

    const tokenRes = await API.post("/auth/login", body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = tokenRes.data.access_token;
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);

    const userRes = await API.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setUser(userRes.data);

    return userRes.data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authLoading,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
