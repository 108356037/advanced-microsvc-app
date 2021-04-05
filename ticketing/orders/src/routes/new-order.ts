import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publisher/order-created-publihser'
import { natsWrapper } from '../nats-wrapper'
import { validateRequest, RequireAuth, BadRequestError, NotFoundError, OrderStatus } from '@158fighterss/common'

const router = express.Router()
const EXPIRATION_WINDOW_SEC = 15*60

router.post('/api/orders/neworder', 
    RequireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string)=> mongoose.Types.ObjectId.isValid(input))
            .withMessage('Ticketid must be provided and be an mongoId')
    ],
    validateRequest,
    async(req: Request, res: Response) => {
        // find the ticket the user is trying to order in DB 
        const {ticketId} = req.body
        const ticket = await Ticket.findById(ticketId)
        if (!ticket) {
            throw new NotFoundError()
        }

        // check if ticket is reserved
        const isReserved = await ticket.isReserved()
        if (isReserved) {
            throw new BadRequestError('the ticket is reserved by other order')
        }

        // calculate expiration date for this order
        const expiration = new Date()
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SEC)

        // build order and save to DB
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })
        await order.save()
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }

        })
        res.status(201).send(order)
    }
)

export { router as newOrderRouter }