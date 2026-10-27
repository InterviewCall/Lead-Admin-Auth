import { Response } from "express";

interface SuccessPayload<T> {
    success: true;
    data: T;
    message: string;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message: string) : void {
    const body: SuccessPayload<T> = {
        success: true,
        data,
        message
    };

    res.status(statusCode).json(body);
}