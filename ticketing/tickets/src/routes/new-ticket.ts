import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { validateRequest, BadRequestError, RequireAuth } from '@158fighterss/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.post('/api/tickets/newticket',
    RequireAuth,
    [
        body('title').trim().notEmpty().withMessage('title must not be empty'),
        body('price').isFloat({gt: 0}).withMessage('price must be a float64')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price} = req.body

        const existingTicket = await Ticket.findOne({title})

        if (existingTicket) {
            throw new BadRequestError('This title is registered')
        }

        const ticket = Ticket.build({title, price, userId: req.currentUser!.id})
        await ticket.save()
        
        res.status(201).send(ticket)
    }
)

export { router as newTicketRouter }