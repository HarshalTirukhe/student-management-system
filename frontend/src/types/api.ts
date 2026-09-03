export interface Course {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  age: number;
  email: string;
  course: Course;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalUsers: number;
  recentStudents: Student[];
}

export interface StudentInput {
  name: string;
  age: number;
  email: string;
  courseId: number;
}

export interface MessageResponse {
  message: string;
}

export interface StudentFormData {
  name: string;
  age: string;
  email: string;
  courseId: string;
}