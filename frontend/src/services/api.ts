const API_URL = import.meta.env.VITE_API_URL;

import type {
  Course,
  DashboardStats,
  LoginResponse,
  RegisterResponse,
  Student,
  StudentInput,
  MessageResponse,
} from "../types/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  // Safely handle response body
  const contentType = response.headers.get("content-type");

  let data: unknown = null;

  if (contentType?.includes("application/json")) {
    data = await response.json();
  }

  // Handle unauthorized / expired session
  if (response.status === 401) {
    window.dispatchEvent(new Event("session-expired"));
    throw new Error("SESSION_EXPIRED");
  }

  // Handle other API errors
  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Something went wrong";

    throw new Error(message);
  }

  return data as T;
}

export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (
    email: string,
    password: string,
  ): Promise<RegisterResponse> => {
    return request<RegisterResponse>("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  },

  getStudents: async (token: string): Promise<Student[]> => {
    return request<Student[]>("/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getStudentById: async (token: string, id: number): Promise<Student> => {
    return request<Student>(`/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createStudent: async (
    token: string,
    student: StudentInput,
  ): Promise<Student> => {
    return request<Student>("/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(student),
    });
  },

  getCourses: async (token: string): Promise<Course[]> => {
    return request<Course[]>("/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateStudent: async (
    token: string,
    id: number,
    student: StudentInput,
  ): Promise<Student> => {
    return request<Student>(`/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(student),
    });
  },

  deleteStudent: async (
    token: string,
    id: number,
  ): Promise<MessageResponse> => {
    return request<MessageResponse>(`/students/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getDashboardStats: async (token: string): Promise<DashboardStats> => {
    return request<DashboardStats>("/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
