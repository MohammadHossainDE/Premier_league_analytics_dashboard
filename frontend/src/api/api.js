
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("pl_auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response?.status === 401;
    const requestUrl = error.config?.url || "";
    const isAuthCall = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

    if (isUnauthorized && !isAuthCall) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export const getTeams = () => API.get("/teams");
export const getFavorites = () => API.get("/favorites");
export const addFavorite = (data) => API.post("/favorites", data);
export const deleteFavorite = (id) => API.delete(`/favorites/${id}`);

export default API;
