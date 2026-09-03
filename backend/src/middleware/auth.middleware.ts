import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

interface JwtPayload {
  userId: number;
  role: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new AppError("Authentication required", 401));
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Invalid authorization header", 401));
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new AppError("JWT secret is not configured", 500));
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
};