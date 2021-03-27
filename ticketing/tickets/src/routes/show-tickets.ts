import express, { Request, Response } from 'express'

import { NotFoundError } from '@158fighterss/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets',
    async(req: Request, res: Response) => {
        const tickets = await Ticket.find({})
        res.status(200).send(tickets)
    }

)

router.get('/api/tickets/:id',
    async(req: Request, res: Response) => {
        const existingTicket = await Ticket.findById(req.params.id)
        if (!existingTicket) {
            throw new NotFoundError()
        }
        res.status(200).send(existingTicket)
    }
)

export {router as showTicketsRouter } 