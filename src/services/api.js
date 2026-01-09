import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://lms-backend-u2ap.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

// Helper function to get token
const getToken = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return "";
    const user = JSON.parse(userStr);
    return user?.token || user?.accessToken || "";
  } catch (error) {
    console.error("Error getting token:", error);
    return "";
  }
};

// Request interceptor - ADD THIS
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - FIX 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
};

// Enquiry API - SIMPLIFIED (token handled by interceptor)
export const enquiryAPI = {
  getEnquiries: (params) => api.get("/enquiries", { params }),
  getEnquiry: (id) => api.get(`/enquiries/${id}`),
  createEnquiry: (data) => api.post("/enquiries", data),
  updateEnquiry: (id, data) => api.put(`/enquiries/${id}`, data),
  deleteEnquiry: (id) => api.delete(`/enquiries/${id}`),
  updateEnquiryStatus: (id, data) => api.put(`/enquiries/${id}/status`, data),
  convertToAdmission: (id) => api.post(`/enquiries/${id}/convert-to-admission`),
  getDashboardStats: () => api.get("/enquiries/stats/dashboard"),
  getMonthlyStats: () => api.get("/enquiries/stats/monthly"),
};

// Admission API
export const admissionAPI = {
  getAdmissions: (params) => api.get("/admissions", { params }),
  getAdmission: (id) => api.get(`/admissions/${id}`),
  createAdmission: (data) => api.post("/admissions", data),
  updateAdmission: (id, data) => api.put(`/admissions/${id}`, data),
  deleteAdmission: (id) => api.delete(`/admissions/${id}`),
  updateStatus: (id, data) => api.put(`/admissions/${id}/status`, data),
  updateFees: (id, data) => api.put(`/admissions/${id}/fees`, data),
  getDashboardStats: () => api.get("/admissions/stats/dashboard"),
  exportAdmission: (id) =>
    api.get(`/admissions/${id}/export`, { responseType: "blob" }),
  getAdmissionActivities: (id) => api.get(`/admissions/${id}/activities`),
};

// Course API
export const courseAPI = {
  getCourses: (params) => api.get("/courses", { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  toggleStatus: (id) => api.put(`/courses/${id}/toggle-status`),
  getCourseStats: () => api.get("/courses/stats/summary"),
  getActiveCourses: () => api.get("/courses/active"),
};

// Setup API
export const setupAPI = {
  getAll: () => api.get("/setup"),
  getActiveData: () => api.get("/setup/active"),
  createQualification: (data) => api.post("/setup/qualifications", data),
  updateQualification: (id, data) =>
    api.put(`/setup/qualifications/${id}`, data),
  deleteQualification: (id) => api.delete(`/setup/qualifications/${id}`),
  createArea: (data) => api.post("/setup/areas", data),
  updateArea: (id, data) => api.put(`/setup/areas/${id}`, data),
  deleteArea: (id) => api.delete(`/setup/areas/${id}`),
  createHoliday: (data) => api.post("/setup/holidays", data),
  updateHoliday: (id, data) => api.put(`/setup/holidays/${id}`, data),
  deleteHoliday: (id) => api.delete(`/setup/holidays/${id}`),
  createBatch: (data) => api.post("/setup/batches", data),
  updateBatch: (id, data) => api.put(`/setup/batches/${id}`, data),
  deleteBatch: (id) => api.delete(`/setup/batches/${id}`),
  updateBatchOrder: (data) => api.put("/setup/batches/order", data),
  createEnquiryMethod: (data) => api.post("/setup/enquiry-methods", data),
  updateEnquiryMethod: (id, data) =>
    api.put(`/setup/enquiry-methods/${id}`, data),
  deleteEnquiryMethod: (id) => api.delete(`/setup/enquiry-methods/${id}`),
  updateEnquiryMethodOrder: (data) =>
    api.put("/setup/enquiry-methods/order", data),
  createFee: (data) => api.post("/setup/fees", data),
  updateFee: (id, data) => api.put(`/setup/fees/${id}`, data),
  deleteFee: (id) => api.delete(`/setup/fees/${id}`),
};

// Faculty API
export const facultyAPI = {
  getFaculty: (params) => api.get("/faculty", { params }),
  getFacultyById: (id) => api.get(`/faculty/${id}`),
  createFaculty: (data) => api.post("/faculty", data),
  updateFaculty: (id, data) => api.put(`/faculty/${id}`, data),
  deleteFaculty: (id) => api.delete(`/faculty/${id}`),
  updateFacultyStatus: (id, data) => api.put(`/faculty/${id}/status`, data),
  getFacultyStats: () => api.get("/faculty/stats/dashboard"),
};

// Student API
export const studentAPI = {
  getStudents: (params) => api.get("/students", { params }),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (data) => api.post("/students", data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

export default api;
