import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card";

import { Button } from "#components/ui/button";
import { getErrorMessage } from "../lib/error";
import type { Student } from "../types/api";

function StudentDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      if (!token || !id) {
        setError("Invalid request");
        setLoading(false);
        return;
      }

      try {
        const data = await api.getStudentById(token, Number(id));
        setStudent(data);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [token, id]);

  return (
    <PageLayout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/students")}>
          ← Back to Students
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Loading student...</p>}

      {error && (
        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && student && (
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>

                <CardDescription className="mt-1 font-medium">
                  Student ID: #{student.id}
                </CardDescription>
              </div>

              {user?.role === "ADMIN" && (
                <Link to={`/students/${student.id}/edit`}>
                  <Button>Edit</Button>
                </Link>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="mt-1 font-medium">{student.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="mt-1 font-medium">{student.age}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Course</p>
                <p className="mt-1 font-medium">
                  {student.course?.name ?? "No course"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Course ID</p>
                <p className="mt-1 font-medium">{student.course?.id ?? "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}

export default StudentDetails;
