import { type Request, type Response } from "express";
import * as courseService from "../services/course.service.js";

export const getCourses = async (req: Request, res: Response) => {
  const courses = await courseService.getAllCourses();

  res.json(courses);
};