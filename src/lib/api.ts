import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── API Service Functions ───

/** Fetch dashboard statistics */
export const getDashboardStats = () => api.get("/dashboard/stats");

/** Fetch all students */
export const getStudents = () => api.get("/students");

/** Fetch single student by ID */
export const getStudent = (id: string) => api.get(`/students/${id}`);

/** Run prediction for a student */
export const predictStudent = (id: string) => api.get(`/predict/${id}`);

/** Upload CSV file */
export const uploadCSV = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/students/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/** Fetch counseling sessions */
export const getCounselingSessions = (studentId?: string) =>
  api.get("/counseling", { params: studentId ? { student_id: studentId } : {} });

/** Add a counseling session */
export const addCounselingSession = (data: {
  student_id: string;
  notes: string;
  follow_up_date?: string;
}) => api.post("/counseling", data);

/** Login */
export const login = (credentials: { username: string; password: string }) =>
  api.post("/auth/login", credentials);

export default api;
