// store/paymentStore.js
import { create } from "zustand";
import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const usePaymentStore = create((set) => ({
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,

  createCheckoutSession: async (paymentData) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_BASE}/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      const data = await res.json();
      set({ currentPayment: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Create Customer Session
  createCustomerSession: async (customerData) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_BASE}/payments/create-customer-session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });
      const data = await res.json();
      set({ currentPayment: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Update Payment
  updatePayment: async (id, paymentData) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_BASE}/payments/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      const data = await res.json();
      set({ currentPayment: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Delete Payment
  deletePayment: async (id) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_BASE}/payments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // Optionally filter from local payments list
      set((state) => ({
        payments: state.payments.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Get Payments with query params
  getPayments: async ({ page = 1, limit = 20, userId }) => {
    const token = Cookies.get("token");
    try {
      set({ loading: true, error: null });
      const res = await fetch(
        `${API_BASE}/payments/?page=${page}&limit=${limit}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      set({ payments: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
