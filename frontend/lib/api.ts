import axios from "axios";

export const api = axios.create({
  baseURL: "http://backend:8000", // Docker service name
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};