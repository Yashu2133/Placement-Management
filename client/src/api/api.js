import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  withCredentials: true,
});

export const NotifyAPI = axios.create({
  baseURL: "http://localhost:3001/api/notifications",
  withCredentials: true,
});

// Attach token to requests
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

API.interceptors.request.use(attachToken);
NotifyAPI.interceptors.request.use(attachToken);

export default API;
