import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  time: Date;
}

interface TodosState {
  todos: Todo[];
  todosOverdue: Todo[];
  todosComplete: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  fetchOverdueTodos: () => Promise<void>;
  fetchCompleteTodos: () => Promise<void>;
  createTodo: (todo: CreateTodoInput) => Promise<void>;
  updateTodo: (id: string, todo: Partial<Todo>) => Promise<void>;
  deleteTodo: (ids: string[]) => Promise<void>;
}

type CreateTodoInput = {
  title: string;
  description: string;
  time: Date;
};

const useTodosStore = create<TodosState>((set) => ({
  todos: [],
  todosOverdue: [],
  todosComplete: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ todos: response.data.data });
    } catch (error) {
      console.log(error);
      set({ error: "Failed to fetch todos" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOverdueTodos: async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/api/todos/overdue", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ todosOverdue: response.data.data });
    } catch (error) {
      set({ error: "Failed to fetch overdue todos" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompleteTodos: async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/api/todos/completed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ todosComplete: response.data.data });
    } catch (error) {
      set({ error: "Failed to fetch completed todos" });
    } finally {
      set({ isLoading: false });
    }
  },

  createTodo: async (todo) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      set({ isLoading: true });

      const response = await api.post("/api/todos", todo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      useTodosStore.getState().fetchTodos();
    } catch (error) {
      console.log(error);
      set({ error: "Failed to create todo" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTodo: async (id, todo) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      set({ isLoading: true });
      await api.put(`/api/todos/${id}`, todo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      useTodosStore.getState().fetchTodos();
    } catch (error) {
      set({ error: "Failed to update todo" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTodo: async (ids: string[]) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      set({ isLoading: true });
      await api.delete("/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
      });
      useTodosStore.getState().fetchTodos();
      useTodosStore.getState().fetchCompleteTodos();
      useTodosStore.getState().fetchOverdueTodos();
    } catch (error) {
      set({ error: "Failed to delete todo" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTodosStore;
