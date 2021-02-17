import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error'
import { DataBaseConnectionError } from '../errors/database-connection-error'

const router = express.Router()

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be 4-20 chars')
],async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }

    console.log('Signing up a new user...')
    throw new DataBaseConnectionError()
    return (res.send({result: 'approved'}))
})

export { router as signupRouter }