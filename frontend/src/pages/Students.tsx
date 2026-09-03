import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Eye, Pencil, Trash2 } from "lucide-react";

import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";

import { Skeleton } from "#components/ui/skeleton";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#components/ui/alert-dialog";

import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";

import { getErrorMessage } from "../lib/error";

import type { Student, Course } from "../types/api";

function Students() {
  const { token, user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  const studentsPerPage = 5;

  // Delete student
  const handleDelete = async () => {
    if (!token || !deleteStudent) {
      return;
    }

    try {
      setDeleting(true);

      await api.deleteStudent(token, deleteStudent.id);

      setStudents((currentStudents) =>
        currentStudents.filter((student) => student.id !== deleteStudent.id),
      );

      toast.success(`${deleteStudent.name} deleted successfully`);

      setDeleteStudent(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  // Load students and courses
  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const [studentsData, coursesData] = await Promise.all([
          api.getStudents(token),
          api.getCourses(token),
        ]);

        setStudents(studentsData);
        setCourses(coursesData);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // Filter students
  const filteredStudents = students.filter((student) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      student.id.toString().includes(searchTerm) ||
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm);

    const matchesCourse =
      courseFilter === "all" || student.course.id.toString() === courseFilter;

    return matchesSearch && matchesCourse;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const startIndex = (currentPage - 1) * studentsPerPage;

  const displayedStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, courseFilter]);

  return (
    <PageLayout>
      <Card>
        {/* Header */}
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">Students</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage all students in the system.
              </p>
            </div>

            {user?.role === "ADMIN" && (
              <Link
                to="/students/add"
                className="flex justify-center sm:justify-start"
              >
                <Button variant="outline" className="w-full sm:w-auto">
                  Add Student
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and filter */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search by ID, name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 flex-1"
            />

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-auto"
            >
              <option value="all">All Courses</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-6 shrink-0" />
                  <Skeleton className="h-5 w-24 sm:w-32" />
                  <Skeleton className="hidden h-5 w-10 sm:block" />
                  <Skeleton className="hidden h-5 w-32 md:block" />
                  <Skeleton className="h-5 w-20 sm:w-32" />
                  <Skeleton className="ml-auto h-8 w-12 sm:w-24" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Students table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>

                    <TableHead>Name</TableHead>

                    <TableHead className="hidden sm:table-cell">Age</TableHead>

                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>

                    <TableHead>Course</TableHead>

                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {displayedStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <p className="font-medium">No students found</p>

                          <p className="text-sm text-muted-foreground">
                            Try changing your search or course filter.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedStudents.map((student) => (
                      <TableRow key={student.id}>
                        {/* ID */}
                        <TableCell>{student.id}</TableCell>

                        {/* Name */}
                        <TableCell className="max-w-32 font-medium sm:max-w-none">
                          <span className="block truncate">{student.name}</span>
                        </TableCell>

                        {/* Age */}
                        <TableCell className="hidden sm:table-cell">
                          {student.age}
                        </TableCell>

                        {/* Email */}
                        <TableCell className="hidden max-w-48 md:table-cell">
                          <span className="block truncate">
                            {student.email}
                          </span>
                        </TableCell>

                        {/* Course */}
                        <TableCell className="max-w-24 sm:max-w-none">
                          <span className="block truncate">
                            {student.course?.name ?? "No course"}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex justify-end gap-1 sm:gap-2">
                            {/* View */}
                            <Link to={`/students/${student.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="px-2 sm:px-3"
                                title="View student"
                              >
                                <Eye className="h-4 w-4 sm:mr-1.5" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                            </Link>

                            {/* Admin actions */}
                            {user?.role === "ADMIN" && (
                              <>
                                <Link to={`/students/${student.id}/edit`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="px-2 sm:px-3"
                                    title="Edit student"
                                  >
                                    <Pencil className="h-4 w-4 sm:mr-1.5" />
                                    <span className="hidden sm:inline">
                                      Edit
                                    </span>
                                  </Button>
                                </Link>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="px-2 sm:px-3"
                                  title="Delete student"
                                  onClick={() => setDeleteStudent(student)}
                                >
                                  <Trash2 className="h-4 w-4 sm:mr-1.5" />
                                  <span className="hidden sm:inline">
                                    Delete
                                  </span>
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="whitespace-nowrap text-sm text-muted-foreground">
                {filteredStudents.length === 0
                  ? "No students found"
                  : `Showing ${startIndex + 1}-${Math.min(
                      startIndex + studentsPerPage,
                      filteredStudents.length,
                    )} of ${filteredStudents.length}`}
              </p>

              {totalPages > 0 && (
                <div className="flex items-center justify-between gap-1.5 sm:justify-end sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    <span className="hidden sm:inline">Previous</span>

                    <span className="sm:hidden">Prev</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="h-9 w-9 px-0"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteStudent}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteStudent(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete student?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deleteStudent?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}

export default Students;
