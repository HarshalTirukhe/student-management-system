import { Router } from "express";
import { getCourses } from "../controllers/course.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getCourses);

export default router;