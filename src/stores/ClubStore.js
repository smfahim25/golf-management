import { create } from "zustand";
import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const useClubStore = create((set) => ({
  clubs: [],
  club: null,
  isLoading: false,
  error: null,

  fetchClubs: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/clubs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch clubs");
      set({ clubs: data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  getClubById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/clubs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch club");
      set({ club: data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createClub: async (clubData) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/clubs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clubData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create club");
      set({ isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  updateClub: async (id, clubData) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/clubs/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clubData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update club");
      set({ isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  deleteClub: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/clubs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete club");
      set({ isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },
}));

export default useClubStore;
