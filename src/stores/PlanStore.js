import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const usePlanStore = create((set) => ({
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,

  // ✅ Create Plan
  createPlan: async (planData) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${API_BASE}/plans`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Failed to create plan");
      }

      const data = await res.json();
      set((state) => ({ plans: [...state.plans, data], loading: false }));
      toast.success("Plan created successfully");
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
    }
  },

  // ✅ Update Plan
  updatePlan: async (id, planData) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${API_BASE}/plans/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Failed to update plan");
      }

      const data = await res.json();
      set({ currentPlan: data, loading: false });
      toast.success("Plan updated successfully");
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
    }
  },

  // ✅ Delete Plan
  deletePlan: async (id) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${API_BASE}/plans/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Failed to delete plan");
      }

      set((state) => ({
        plans: state.plans.filter((p) => p._id !== id),
        loading: false,
      }));
      toast.success("Plan deleted successfully");
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
    }
  },

  // ✅ Get Single Plan
  getPlan: async (id) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${API_BASE}/plans/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Failed to fetch plan");
      }

      const data = await res.json();
      set({ currentPlan: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
    }
  },

  // ✅ Get All Plans
  getPlans: async () => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${API_BASE}/plans`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Failed to fetch plans");
      }

      const data = await res.json();
      set({ plans: data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
    }
  },
}));
