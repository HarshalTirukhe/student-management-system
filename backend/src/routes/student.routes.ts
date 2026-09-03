import { Router } from "express";

import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

import {
  validate,
  validateParams,
} from "../middleware/validate.middleware.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  createStudentSchema,
  updateStudentSchema,
  studentIdSchema,
} from "../schemas/student.schema.js";

const router = Router();

router.use(authenticate);

// USER + ADMIN
router.get("/", getStudents);

router.get(
  "/:id",
  validateParams(studentIdSchema),
  getStudent
);

// ADMIN ONLY
router.post(
  "/",
  requireRole("ADMIN"),
  validate(createStudentSchema),
  createStudent
);

router.put(
  "/:id",
  requireRole("ADMIN"),
  validateParams(studentIdSchema),
  validate(updateStudentSchema),
  updateStudent
);

router.delete(
  "/:id",
  requireRole("ADMIN"),
  validateParams(studentIdSchema),
  deleteStudent
);

export default router;