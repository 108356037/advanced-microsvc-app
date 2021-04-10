import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { validateRequest, RequireAuth, BadRequestError } from '@158fighterss/common'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/tickets/newticket',
    RequireAuth,
    [
        body('title').trim().notEmpty().withMessage('title must not be empty'),
        body('price').isFloat({gt: 0}).withMessage('price must be a float64')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {title, price} = req.body

        const existingTicket = await Ticket.findOne({title})

        if (existingTicket) {
            throw new BadRequestError("this ticket name is registered")
        }

        const ticket = Ticket.build({title, price, userId: req.currentUser!.id})
        await ticket.save()

        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
        })
        
        res.status(201).send(ticket)
    }
)

export { router as newTicketRouter }