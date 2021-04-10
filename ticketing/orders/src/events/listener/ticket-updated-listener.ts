import { Message } from 'node-nats-streaming'
import { Subjects, baseListener, TicketUpdatedEvent } from '@158fighterss/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends baseListener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data)

        if (!ticket) {
            throw new Error('Ticket not found or version not correct!' )
        }

        const { title, price } = data
        ticket.set({
            title,
            price
        })
        await ticket.save()

        msg.ack()
    }
}