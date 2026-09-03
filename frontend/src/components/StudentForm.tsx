import type { ChangeEvent, FormEvent } from "react";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { Button } from "#components/ui/button";
import type { Course, StudentFormData } from "../types/api";

interface StudentFormProps {
  formData: StudentFormData;
  courses: Course[];
  loading: boolean;
  error: string;
  submitText: string;
  loadingText: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onCancel: () => void;
}

function StudentForm({
  formData,
  courses,
  loading,
  error,
  submitText,
  loadingText,
  onSubmit,
  onChange,
  onCancel,
}: StudentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>

        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Enter student name"
          required
        />
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>

        <Input
          id="age"
          name="age"
          type="number"
          min="16"
          value={formData.age}
          onChange={onChange}
          placeholder="Enter age"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="student@example.com"
          required
        />
      </div>

      {/* Course */}
      <div className="space-y-2">
        <Label htmlFor="courseId">Course</Label>

        <select
          id="courseId"
          name="courseId"
          value={formData.courseId}
          onChange={onChange}
          disabled={loading}
          required
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Select a course</option>

          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? loadingText : submitText}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default StudentForm;