import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app.error.js";
import { NODE_ENV } from "../configs/server.config.js";

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {

    if(error instanceof AppError) {
        const body: Record<string, unknown> = {
            success: false,
            message: error.message
        }

        if(error.details) body['details'] = error.details;

        res.status(error.statusCode).json(body);

        return;
    }

    const body: Record<string, unknown> = {
        success: false,
        message: "Something went wrong",
    }

    if(NODE_ENV === 'development') body['details'] = error.stack;

    res.status(500).json(body);
}