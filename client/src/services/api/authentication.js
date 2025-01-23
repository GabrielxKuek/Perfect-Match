import axios from "axios";

const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:8000/api"
  : "https://perfect-match-qmgd.onrender.com/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  
  // set localstorage
  if (response.data.success && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.user.role.name);
    localStorage.setItem("username", response.data.user.username);
  }

  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  
  if (response.data.success && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.user.role.name);
    localStorage.setItem("username", response.data.user.username);
  }
  
  return response.data;
};
