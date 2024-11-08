import axios from "axios";

const api = axios.create({
  baseURL: "https://todolist-api-nine.vercel.app",
});

export default api;
