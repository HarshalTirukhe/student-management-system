import { type Request, type Response } from "express";
import * as authService from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.registerUser(email, password);

  res.status(201).json({
    message: "User registered successfully",
    user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  res.json({
    message: "Login successful",
    ...result,
  });
};