import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { NonAuthorizedError, NotFoundError, RequireAuth, validateRequest } from '@158fighterss/common'
import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put('/api/tickets/:id', 
    RequireAuth, 
    [
        body('title').trim().notEmpty().withMessage('title must not be empty'),
        body('price').isFloat({gt: 0}).withMessage('price must be a float64')
    ],
    validateRequest,
    async(req: Request, res: Response) => {
        const existingTicket = await Ticket.findById(req.params.id)
        if (!existingTicket) {
            throw new NotFoundError()
        }
        if (req.currentUser!.id !== existingTicket.userId) {
            throw new NonAuthorizedError()
        }
        existingTicket.set({
            title: req.body.title,
            price: req.body.price
        })
        await existingTicket.save()

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: existingTicket.id,
            title: existingTicket.title,
            price: existingTicket.price,
            userId: existingTicket.userId
        })

        res.status(200).send(existingTicket)
    }
    
)

export {router as updateTicketsRouter } 