import * as z from "zod";

export const createStudentSchema = z.object({
    name: z.string().min(2).max(100),
    age: z.number().int().min(16),
    email: z.email(),
    courseId: z.number().int().positive(),
});

export const updateStudentSchema = createStudentSchema;

export const studentIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});