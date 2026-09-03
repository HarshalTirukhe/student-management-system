import {
    type Request,
    type Response,
    type NextFunction,
} from "express";

import type { ZodType } from "zod";

export const validate = (schema: ZodType) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }

        req.body = result.data;

        next();
    };
};

export const validateParams = (schema: ZodType) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid URL parameters",
                errors: result.error.issues,
            });
        }

        req.params = result.data as typeof req.params;

        next();
    };
};