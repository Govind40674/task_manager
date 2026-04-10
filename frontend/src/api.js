import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000"
});

export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id) => API.patch(`/tasks/${id}`);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);