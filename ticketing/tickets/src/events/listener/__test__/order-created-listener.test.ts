import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import  mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from '@158fighterss/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    const userId = mongoose.Types.ObjectId().toHexString()
    const listener = new OrderCreatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'concert',
        price: 19.99,
        userId: 'jfiejfi',
    })

    await ticket.save()

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: ticket.version,
        status: OrderStatus.Created,
        userId: userId,
        expiresAt: 'someFakeISOTIME',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, ticket, data, msg }
}

it('sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)
    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publish a ticket updated event when order created', async () => {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(data.id).toEqual(ticketUpdatedData.orderId)
})