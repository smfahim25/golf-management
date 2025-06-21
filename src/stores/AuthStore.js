import { create } from "zustand";
import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const useAuthStore = create((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  token: Cookies.get("token") || null,
  isLoading: false,
  error: null,

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      const { accessToken, role, ...userDetails } = data.data;

      localStorage.setItem("user", JSON.stringify({ ...userDetails, role }));
      Cookies.set("token", accessToken, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });

      set({
        user: { ...userDetails, role },
        token: accessToken,
        isLoading: false,
      });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const { accessToken, role, ...userDetails } = data.data;

      localStorage.setItem("user", JSON.stringify({ ...userDetails, role }));
      Cookies.set("token", accessToken, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });

      set({
        user: { ...userDetails, role },
        token: accessToken,
        isLoading: false,
      });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/verify-email?token=${token}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");

      set({ isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    Cookies.remove("role");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
