import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket' 
import { TicketUpdatedEvent } from '@158fighterss/common'
import  mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const newTitle = 'concertV2'
const newPrice = 22.99

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save()
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: newTitle,
        price: newPrice,
        userId: mongoose.Types.ObjectId().toHexString()
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, ticket, msg}
}

it('finds, updates, and save a ticket', async() => {
    const { listener, data, ticket, msg } = await setup()
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id) //update doesn't change the ticket id
    expect(updatedTicket?.version).toEqual(ticket.version+1)
    expect(updatedTicket?.title).toEqual(newTitle)
    expect(updatedTicket?.price).toEqual(newPrice)
})

it('check if message published, ack is called', async() => {
    const { listener, data, msg } = await setup()
     await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})



it('does not call ack if event version conflicts', async () => {
    const { listener, data, msg } = await setup()

    data.version = 2 // insert option created a record with version: 0, so next update should be version: 1

    try {
        await listener.onMessage(data, msg)
    } catch (error) {
        
    }
    
    expect(msg.ack).not.toHaveBeenCalled()
});