import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: false,
  error: null,

  register: async (username, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post("/api/auth/register", {
        username,
        password,
      });
      set({ token: response.data.token });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Registration failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (username, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });
      const data = response.data;

      await AsyncStorage.setItem("username", data.username);
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Login failed" });
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async (): Promise<boolean> => {
    try {
      set({ isLoading: true, error: null });

      const username = await AsyncStorage.getItem("username");
      const token = await AsyncStorage.getItem("token");

      const response = await api.get(`/api/auth/me/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        set({ token: response.data.token });
        return true;
      }

      return false;
    } catch (error: any) {
      console.log("Error response:", error.response);
      set({ error: "Token expired or invalid" });
      set({ token: null });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => set({ token: null, error: null }),
}));

export default useAuthStore;
