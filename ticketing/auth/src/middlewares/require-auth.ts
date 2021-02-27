import { Request, Response, NextFunction } from 'express'
import { NonAuthorizedError } from '../errors/require-auth-error'

export const RequireAuth = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (!req.currentUser) {
        throw new NonAuthorizedError()
    }

    next()
}
