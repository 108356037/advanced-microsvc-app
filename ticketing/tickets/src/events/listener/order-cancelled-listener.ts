import { Message } from 'node-nats-streaming'
import { Subjects, baseListener, OrderCancelledEvent, OrderStatus } from '@158fighterss/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher'

export class OrderCancelledListener extends baseListener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
       // find the ticket that the order is reserving
       const existingTicket = await Ticket.findById(data.ticket.id)
        if (!existingTicket) {
            throw new Error('Ticket not found')
        }
       // delete the ticket's orderId because order cancelled
       existingTicket.set({ orderId: undefined })
       await existingTicket.save()

       await new TicketUpdatedPublisher(this.client).publish({
           id: existingTicket.id,
           userId: existingTicket.userId,
           title: existingTicket.title,
           price: existingTicket.price,
           version: existingTicket.version,
           orderId: existingTicket.orderId,
       })

       msg.ack()
    }
}