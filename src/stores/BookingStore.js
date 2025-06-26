import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const useBookingStore = create((set) => ({
  bookings: [],
  booking: null,
  isLoading: false,
  error: null,
  availability: null,

  getAllBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");
      set({ bookings: data, isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  getBookingById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch booking");
      set({ booking: data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create booking");
      set({ isLoading: false });
      toast.success("Slot booked successfully!");
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  updateBooking: async (id, bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update booking");
      set({ isLoading: false });
      toast.success("Booked slot updated successfully");
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },
  getMyBookings: async ({ date, club, bay } = {}) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const params = new URLSearchParams();
      if (date) params.append("date", date);
      if (club) params.append("club", club);
      if (bay) params.append("bay", bay);

      const res = await fetch(`${API_BASE}/bookings/me?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch your bookings");

      set({ bookings: data, isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return [];
    }
  },

  deleteBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete booking");
      set({ isLoading: false });
      toast.success("Booked slot delete successfully");
      await getMyBookings.get();
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  checkAvailability: async (date, clubId, timezone, bay) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");
      const params = new URLSearchParams({
        date,
        club: clubId,
        timezone: timezone,
        ...(bay && { bay }),
      }).toString();

      const res = await fetch(`${API_BASE}/bookings/availability?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to check availability");

      set({ availability: data, isLoading: false });
      return data.data || data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return [];
    }
  },
}));

export default useBookingStore;
