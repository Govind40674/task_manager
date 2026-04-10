import axios from "axios";
const API = axios.create({
  baseURL:import.meta.env.VITE_BASE_URL,
});


export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id) => API.patch(`/tasks/${id}`);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);