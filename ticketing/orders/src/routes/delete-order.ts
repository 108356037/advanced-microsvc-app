import { NonAuthorizedError, NotFoundError, RequireAuth } from '@158fighterss/common'
import express, { Request, Response } from 'express'
import { Order, OrderStatus } from '../models/order'
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.delete('/api/orders/:orderId', 
    RequireAuth,
    async(req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId).populate('ticket')

        if (!order) {
            throw new NotFoundError()
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NonAuthorizedError()
        }
        order.status = OrderStatus.Cancelled
        await order.save()

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id
            },
            version: order.version
        })
        
        res.status(204).send(order)
    }
)

export { router as deleteOrderRouter }