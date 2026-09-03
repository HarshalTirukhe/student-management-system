import { type Request, type Response } from "express";
import * as dashboardService from "../services/dashboard.service.js";

export const getDashboardStats = async (
  req: Request,
  res: Response,
) => {
  const stats = await dashboardService.getDashboardStats();

  res.json(stats);
};