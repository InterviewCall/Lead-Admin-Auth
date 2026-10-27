import { NextFunction, Request, Response  } from "express"

export const attchCorrelationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const correaltionId = crypto.randomUUID();

    req.headers['x-correlation-id'] = correaltionId;

    next();
}