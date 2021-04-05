import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'

import { validateRequest, RequireAuth, BadRequestError } from '@158fighterss/common'

const router = express.Router()

router.post('/api/neworders', 
    RequireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string)=> mongoose.Types.ObjectId.isValid(input))
            .withMessage('Ticketid nust be provided and be an mongoId')
    ],
    validateRequest,
    async(req: Request, res: Response) => {
        console.log('api called')
        res.send({})
    }
)

export { router as newOrderRouter }