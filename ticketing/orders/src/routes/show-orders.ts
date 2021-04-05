import { NonAuthorizedError, NotFoundError, RequireAuth } from '@158fighterss/common'
import express, { Request, response, Response } from 'express'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders', 
    RequireAuth,
    async(req: Request, res: Response) => {
        const orders = await Order.find({
            userId: req.currentUser!.id
        }).populate('ticket')

        res.status(200).send(orders)
    }
)

router.get('/api/orders/:orderId', 
    RequireAuth,
    async(req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId).populate('ticket')
        
        if (!order) {
            throw new NotFoundError()
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NonAuthorizedError()
        }
        res.status(200).send(order)
    }
) 

export { router as showOrdersRouter }