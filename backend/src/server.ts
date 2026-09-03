import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";


import studentRoutes from "./routes/student.routes.js";
import courseRoutes from "./routes/course.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(helmet());

app.use(cors({ origin: FRONTEND_URL }));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Student Management API",
  });
});

app.use("/students", studentRoutes);
app.use("/auth", authLimiter, authRoutes);
app.use("/courses", courseRoutes);
app.use("/dashboard", dashboardRoutes);


// MUST be after routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
