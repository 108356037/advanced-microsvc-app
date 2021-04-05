import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/api/orders', 
    async(req: Request, res: Response) => {
        console.log('api called')
        res.send({})
    }
)

router.get('/api/orders/:orderId', 
    async(req: Request, res: Response) => {
        console.log('api called')
        res.send({})
    }
)

export { router as showOrdersRouter }