import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly details?: unknown;

    constructor(message: string, statusCode: number, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotfoundError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, StatusCodes.NOT_FOUND, details);
    } 
}

export class InternalServerError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR, details);
    } 
}

export class BadRequestError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, StatusCodes.BAD_REQUEST, details);
    } 
}

export class NotimplementedError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, StatusCodes.NOT_IMPLEMENTED, details);
    } 
}

export class UnauthorizedError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, StatusCodes.UNAUTHORIZED, details);
    }
}

export class ConflictError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, StatusCodes.CONFLICT, details);
    }
}