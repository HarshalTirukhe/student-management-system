import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Users,
  BookOpen,
  UserRound,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";

import { Button } from "#components/ui/button";
import { getErrorMessage } from "../lib/error";

import type { DashboardStats } from "../types/api";

function Dashboard() {
  const { token, user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const data = await api.getDashboardStats(token);
        setStats(data);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-2 text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-muted-foreground">Loading dashboard...</p>
        )}

        {/* Error */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Dashboard content */}
        {!loading && !error && stats && (
          <>
            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Students */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>

                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Students registered in the system
                  </p>
                </CardContent>
              </Card>

              {/* Courses */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Courses
                  </CardTitle>

                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Courses available
                  </p>
                </CardContent>
              </Card>

              {/* Users */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>

                  <UserRound className="h-5 w-5 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Registered accounts
                  </p>
                </CardContent>
              </Card>

              {/* Role */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Your Role
                  </CardTitle>

                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <p className="text-3xl font-bold">{user?.role}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Current account permission
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Students */}
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Students</CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Recently added students
                    </p>
                  </div>

                  <Link to="/students">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                {stats.recentStudents.length === 0 ? (
                  <p className="text-muted-foreground">No students found.</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>

                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:text-right">
                          <p className="text-sm font-medium">
                            {student.course.name}
                          </p>

                          <Link
                            to={`/students/${student.id}`}
                            className="text-sm font-medium underline underline-offset-4 hover:no-underline"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default Dashboard;
