import { NonAuthorizedError, NotFoundError, RequireAuth } from '@158fighterss/common'
import express, { Request, Response } from 'express'
import { Order, OrderStatus } from '../models/order'

const router = express.Router()

router.delete('/api/orders/:orderId', 
    RequireAuth,
    async(req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId)

        if (!order) {
            throw new NotFoundError()
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NonAuthorizedError()
        }
        order.status = OrderStatus.Cancelled
        await order.save()
        
        res.status(204).send(order)
    }
)

export { router as deleteOrderRouter }