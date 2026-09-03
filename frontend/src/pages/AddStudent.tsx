import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";

import PageLayout from "../components/PageLayout";
import StudentForm from "../components/StudentForm";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import { studentFormSchema } from "../schemas/student.schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card";

import { Button } from "#components/ui/button";
import { toast } from "sonner";

import type { Course, StudentFormData } from "../types/api";

function AddStudent() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);

  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    age: "",
    email: "",
    courseId: "",
  });

  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState("");

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      if (!token) {
        setCoursesLoading(false);
        return;
      }

      try {
        const data = await api.getCourses(token);
        setCourses(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load courses",
        );
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, [token]);

  // Handle form fields
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Authentication required");
      return;
    }

    // Validate form using Zod
    const result = studentFormSchema.safeParse(formData);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    // Zod has already converted age and courseId to numbers
    const student = result.data;

    setError("");
    setLoading(true);

    try {
      await api.createStudent(token, student);
      toast.success("Student added successfully");

      navigate("/students");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create student",
      );
    } finally {
      setLoading(false);
    }
  };

  // Frontend protection
  if (user?.role !== "ADMIN") {
    return (
      <PageLayout>
       <Card className="mx-auto w-full max-w-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>

            <CardDescription>
              Only administrators can add students.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link to="/students">
              <Button>Back to Students</Button>
            </Link>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Card className="mx-auto max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Add Student</CardTitle>

          <CardDescription>Add a new student to the system.</CardDescription>
        </CardHeader>

        <CardContent>
          <StudentForm
            formData={formData}
            courses={courses}
            loading={loading || coursesLoading}
            error={error}
            submitText="Add Student"
            loadingText="Adding..."
            onSubmit={handleSubmit}
            onChange={handleChange}
            onCancel={() => navigate("/students")}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}

export default AddStudent;
