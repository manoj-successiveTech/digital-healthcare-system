// API configuration for HealthcarePro frontend
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    headers: defaultHeaders,
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  logout: async () => {
    try {
      await makeAuthenticatedRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
  },

  getProfile: async () => {
    // Use the main dashboard endpoint instead of profile
    return makeAuthenticatedRequest("/dashboard");
  },

  updateProfile: async (profileData) => {
    // For now, return a placeholder since profile update isn't implemented
    return { success: true, message: "Profile update not implemented yet" };
  },
};

// Dashboard API functions 
export const dashboardAPI = {
  // General dashboard (works for all user types)
  getDashboard: async () => {
    return makeAuthenticatedRequest("/dashboard");
  },

  // Patient dashboard
  getPatientStats: async () => {
    return makeAuthenticatedRequest("/dashboard/patient/stats");
  },

  // Doctor dashboard
  getDoctorStats: async () => {
    return makeAuthenticatedRequest("/dashboard/doctor/stats");
  },

  // Admin dashboard
  getAdminStats: async () => {
    return makeAuthenticatedRequest("/dashboard/admin/stats");
  },

  // Admin user management
  getAllUsers: async (page = 1, limit = 10) => {
    return makeAuthenticatedRequest(
      `/dashboard/admin/users?page=${page}&limit=${limit}`
    );
  },

  updateUserStatus: async (userId, isActive) => {
    return makeAuthenticatedRequest(`/dashboard/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  },
};

// Users API functions
export const usersAPI = {
  // Get doctors by department
  getDoctorsByDepartment: async (department) => {
    const queryParams = department
      ? `?department=${encodeURIComponent(department)}`
      : "";
    return await makeAuthenticatedRequest(`/users/doctors${queryParams}`, {
      method: "GET",
    });
  },

  // Get all doctors
  getAllDoctors: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams
      ? `/users/doctors?${queryParams}`
      : "/users/doctors";
    return await makeAuthenticatedRequest(url, {
      method: "GET",
    });
  },
};

// Appointments API functions
export const appointmentsAPI = {
  // Create new appointment
  createAppointment: async (appointmentData) => {
    return await makeAuthenticatedRequest("/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },

  // Get user's appointments
  getAppointments: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/appointments?${queryParams}` : "/appointments";
    return await makeAuthenticatedRequest(url, {
      method: "GET",
    });
  },

  // Update appointment status
  updateAppointment: async (appointmentId, updateData) => {
    return await makeAuthenticatedRequest(`/appointments/${appointmentId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    return await makeAuthenticatedRequest(`/appointments/${appointmentId}`, {
      method: "DELETE",
    });
  },
};

// Generic API helper
export const apiHelper = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.message.includes("Invalid or expired token")) {
      // Token expired, redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        window.location.href = "/auth/login";
      }
    }
    return error.message;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get user data from localStorage
  getUserData: () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },
};

const api = {
  authAPI,
  dashboardAPI,
  usersAPI,
  appointmentsAPI,
  apiHelper,
};

export default api;
