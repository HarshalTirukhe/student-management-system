import * as z from "zod";

export const studentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(16, "Age must be at least 16"),

  email: z.email("Please enter a valid email address"),

  courseId: z.coerce
    .number()
    .int("Please select a valid course")
    .positive("Please select a course"),
});