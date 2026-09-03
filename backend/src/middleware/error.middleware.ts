import {
    type Request,
    type Response
} from "express";

import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response
) => {
    console.error(error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
        return res.status(409).json({
            message: "A record with this value already exists",
        });
    }

    if (error.code === "P2025") {
        return res.status(404).json({
            message: "Record not found",
        });
    }

    if (error.code === "P2003") {
        return res.status(400).json({
            message: "Invalid related record",
        });
    }
}

    res.status(500).json({
        message: "Internal server error",
    });
};