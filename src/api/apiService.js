import axios from "axios";
import * as mockApi from "./mockApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);

export const api = apiClient;

export const request = async (method, url, data) => {
  if (USE_MOCK_API) {
    const endpoint = url.replace(/^\//, "");
    if (method === "GET" && endpoint === "dashboard-summary") return mockApi.dashboardSummaryApi();
    if (method === "POST" && endpoint === "login") return mockApi.loginApi(data);
    if (method === "GET" && endpoint === "customers") return mockApi.customersApi.list();
    if (method === "POST" && endpoint === "customers") return mockApi.customersApi.create(data);
    if (method === "GET" && endpoint.startsWith("customers/")) return mockApi.customersApi.get(endpoint.split("/")[1]);
    if (method === "PUT" && endpoint.startsWith("customers/")) return mockApi.customersApi.update(endpoint.split("/")[1], data);
    if (method === "DELETE" && endpoint.startsWith("customers/")) return mockApi.customersApi.remove(endpoint.split("/")[1]);
    if (method === "GET" && endpoint === "booth-assignments") return mockApi.boothAssignmentsApi.list();
    if (method === "POST" && endpoint === "booth-assignments") return mockApi.boothAssignmentsApi.create(data);
    if (method === "PUT" && endpoint.startsWith("booth-assignments/")) return mockApi.boothAssignmentsApi.update(endpoint.split("/")[1], data);
    if (method === "DELETE" && endpoint.startsWith("booth-assignments/")) return mockApi.boothAssignmentsApi.remove(endpoint.split("/")[1]);
    if (method === "POST" && endpoint === "customer-status") return mockApi.customerStatusApi.create(data.customerId, data.payload);
    if (method === "GET" && endpoint.startsWith("customer-status/")) return mockApi.customerStatusApi.getHistory(endpoint.split("/")[1]);
    if (method === "GET" && endpoint.startsWith("qr-codes/verify/")) return mockApi.qrVerificationApi(endpoint.split("/").pop());
    if (method === "POST" && endpoint === "customers/check-in") return mockApi.checkInApi(data.customerId);
  }

  const response = await apiClient.request({ method, url, data });
  return response.data;
};
