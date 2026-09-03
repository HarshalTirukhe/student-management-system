import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

function EditStudent() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);

  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    age: "",
    email: "",
    courseId: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load student and courses
  useEffect(() => {
    const loadData = async () => {
      if (!token || !id) {
        setError("Invalid request");
        setLoading(false);
        return;
      }

      try {
        const [student, coursesData] = await Promise.all([
          api.getStudentById(token, Number(id)),
          api.getCourses(token),
        ]);

        setFormData({
          name: student.name,
          age: String(student.age),
          email: student.email,
          courseId: String(student.course.id),
        });

        setCourses(coursesData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load student",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, id]);

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

    if (!token || !id) {
      setError("Authentication required");
      return;
    }

    // Validate form using Zod
    const result = studentFormSchema.safeParse(formData);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    // Zod converts age and courseId to numbers
    const student = result.data;

    setError("");
    setSaving(true);

    try {
      await api.updateStudent(token, Number(id), student);
      toast.success("Student updated successfully");

      navigate(`/students/${id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update student",
      );
    } finally {
      setSaving(false);
    }
  };

  // Frontend protection
  if (user?.role !== "ADMIN") {
    return (
      <PageLayout>
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>

            <CardDescription>
              Only administrators can edit students.
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
          <CardTitle className="text-2xl">Edit Student</CardTitle>

          <CardDescription>Update the student's information.</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading student...</p>
          ) : (
            <StudentForm
              formData={formData}
              courses={courses}
              loading={saving}
              error={error}
              submitText="Save Changes"
              loadingText="Saving..."
              onSubmit={handleSubmit}
              onChange={handleChange}
              onCancel={() => navigate(`/students/${id}`)}
            />
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}

export default EditStudent;
