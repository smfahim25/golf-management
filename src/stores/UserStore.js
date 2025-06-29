import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

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
        users: data.data.users,
        totalUsers: data.data.meta?.total || 0,
        isLoading: false,
      });
      return data.data.users;
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
  updateUser: async (id, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      let body;
      let headers = {
        Authorization: `Bearer ${token}`,
      };

      if (updateData instanceof FormData) {
        // For FormData, do not set Content-Type, the browser will do it (with boundary)
        body = updateData;
      } else {
        // For JSON data, stringify & set Content-Type
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(updateData);
      }

      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers,
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");

      // Update store
      set((state) => ({
        user:
          state.user && state.user._id === id
            ? { ...state.user, ...data.data }
            : state.user,
        users: state.users.map((u) =>
          u._id === id ? { ...u, ...data.data } : u
        ),
        isLoading: false,
      }));
      toast.success("User updated successfully");
      return data.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      // Remove the deleted user from the local store
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
        user: state.user && state.user._id === id ? null : state.user,
        isLoading: false,
      }));

      toast.success("User deleted successfully");
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error(err.message);
    }
  },
}));

export default useUserStore;
