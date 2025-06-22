import { create } from "zustand";
import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const useUserStore = create((set) => ({
  users: [],
  user: null,
  isLoading: false,
  error: null,
  totalUsers: 0,

  getUserById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user");
      set({ user: data.data, isLoading: false });
      return data.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  getAllUsers: async ({
    page = 1,
    limit = 50,
    role,
    isVerified,
    searchTerm,
  } = {}) => {
    set({ isLoading: true, error: null });

    try {
      const token = Cookies.get("token");

      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (role) params.append("role", role);
      if (isVerified !== undefined) params.append("isVerified", isVerified);
      if (searchTerm) params.append("searchTerm", searchTerm);

      const res = await fetch(`${API_BASE}/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      set({
        users: data.data,
        totalUsers: data.meta?.total || 0,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));

export default useUserStore;
