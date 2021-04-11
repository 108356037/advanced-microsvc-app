import { Message } from 'node-nats-streaming'
import { Subjects, baseListener, OrderCreatedEvent } from '@158fighterss/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher'

export class OrderCreatedListener extends baseListener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
       // find the ticket that the order is reserving
       const existingTicket = await Ticket.findById(data.ticket.id)
        if (!existingTicket) {
            throw new Error('Ticket not found')
        }
       // mark the ticket as reserved by setting its orderId property
       existingTicket.set({ orderId: data.id })
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