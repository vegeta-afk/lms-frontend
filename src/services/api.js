import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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

// Enquiry API
export const enquiryAPI = {
  // CRUD Operations
  getEnquiries: (params) => api.get("/enquiries", { params }),
  getEnquiry: (id) => api.get(`/enquiries/${id}`),
  createEnquiry: (data) => api.post("/enquiries", data),
  updateEnquiry: (id, data) => api.put(`/enquiries/${id}`, data),
  deleteEnquiry: (id) => api.delete(`/enquiries/${id}`),

  // Special Operations
  updateStatus: (id, data) => api.put(`/enquiries/${id}/status`, data),
  convertToAdmission: (id) => api.post(`/enquiries/${id}/convert-to-admission`),

  // Dashboard
  getDashboardStats: () => api.get("/enquiries/stats/dashboard"),
  getMonthlyStats: () => api.get("/enquiries/stats/monthly"),
};

// Admission API
export const admissionAPI = {
  // CRUD Operations
  getAdmissions: (params) => api.get("/admissions", { params }),
  getAdmission: (id) => api.get(`/admissions/${id}`),
  createAdmission: (data) => api.post("/admissions", data),
  updateAdmission: (id, data) => api.put(`/admissions/${id}`, data),
  deleteAdmission: (id) => api.delete(`/admissions/${id}`),

  // Special Operations
  updateStatus: (id, data) => api.put(`/admissions/${id}/status`, data),
  updateFees: (id, data) => api.put(`/admissions/${id}/fees`, data),

  // Dashboard
  getDashboardStats: () => api.get("/admissions/stats/dashboard"),

  // New Operations
  exportAdmission: (id) =>
    api.get(`/admissions/${id}/export`, { responseType: "blob" }),
  getAdmissionActivities: (id) => api.get(`/admissions/${id}/activities`),
};

// ✅ ADD COURSE API HERE
export const courseAPI = {
  // CRUD Operations
  getCourses: (params) => api.get("/courses", { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // Special Operations
  toggleStatus: (id) => api.put(`/courses/${id}/toggle-status`),

  // Dashboard
  getCourseStats: () => api.get("/courses/stats/summary"),

  // Dropdown / Enquiry usage
  getActiveCourses: () => api.get("/courses/active"),
};

export const setupAPI = {
  // Get all setup data
  getAll: () => api.get("/setup"),

  getActiveData: () => api.get("/setup/active"),

  // Qualifications
  createQualification: (data) => api.post("/setup/qualifications", data),
  updateQualification: (id, data) =>
    api.put(`/setup/qualifications/${id}`, data),
  deleteQualification: (id) => api.delete(`/setup/qualifications/${id}`),

  // Areas
  createArea: (data) => api.post("/setup/areas", data),
  updateArea: (id, data) => api.put(`/setup/areas/${id}`, data),
  deleteArea: (id) => api.delete(`/setup/areas/${id}`),

  // Holidays
  createHoliday: (data) => api.post("/setup/holidays", data),
  updateHoliday: (id, data) => api.put(`/setup/holidays/${id}`, data),
  deleteHoliday: (id) => api.delete(`/setup/holidays/${id}`),

  // Batches
  createBatch: (data) => api.post("/setup/batches", data),
  updateBatch: (id, data) => api.put(`/setup/batches/${id}`, data),
  deleteBatch: (id) => api.delete(`/setup/batches/${id}`),
  updateBatchOrder: (data) => api.put("/setup/batches/order", data),

  // Enquiry Methods
  createEnquiryMethod: (data) => api.post("/setup/enquiry-methods", data),
  updateEnquiryMethod: (id, data) =>
    api.put(`/setup/enquiry-methods/${id}`, data),
  deleteEnquiryMethod: (id) => api.delete(`/setup/enquiry-methods/${id}`),
  updateEnquiryMethodOrder: (data) =>
    api.put("/setup/enquiry-methods/order", data),

  // Fees
  createFee: (data) => api.post("/setup/fees", data),
  updateFee: (id, data) => api.put(`/setup/fees/${id}`, data),
  deleteFee: (id) => api.delete(`/setup/fees/${id}`),
};

export const facultyAPI = {
  // CRUD Operations
  getFaculty: (params) => api.get("/faculty", { params }),
  getFacultyById: (id) => api.get(`/faculty/${id}`),
  createFaculty: (data) => api.post("/faculty", data),
  updateFaculty: (id, data) => api.put(`/faculty/${id}`, data),
  deleteFaculty: (id) => api.delete(`/faculty/${id}`),

  // Special Operations
  updateFacultyStatus: (id, data) => api.put(`/faculty/${id}/status`, data),

  // Dashboard
  getFacultyStats: () => api.get("/faculty/stats/dashboard"),
};
// Export the instance for custom requests
export default api;
