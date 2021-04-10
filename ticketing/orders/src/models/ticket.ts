import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order, OrderStatus } from './order'

interface TicketAttrs {
    id: string 
    title: string
    price: number
}

export interface TicketDoc extends mongoose.Document {
    title: string
    price: number
    isReserved(): Promise<boolean>
    version: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    })
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
