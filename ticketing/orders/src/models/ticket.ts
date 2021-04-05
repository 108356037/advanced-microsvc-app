import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'

interface TicketAttrs {
    title: string
    price: number
}

export interface TicketDoc extends mongoose.Document {
    title: string
    price: number
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id           
        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

// make sure the ticket is not held by other Order, so we find the order 
// and check if it's in  created/await:payment/complete 
ticketSchema.methods.isReserved = async function() {
    const existingOrder = await Order.findOne({
        //@ts-ignore
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitPayment,
                OrderStatus.Complete
            ]
        }
    })
    return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
