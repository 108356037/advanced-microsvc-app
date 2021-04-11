import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import  mongoose from 'mongoose'
import { OrderCancelledEvent } from '@158fighterss/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    const orderId = mongoose.Types.ObjectId().toHexString()
    const listener = new OrderCancelledListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'concert',
        price: 19.99,
        userId: 'jfiejfi',
    })
    ticket.set({ orderId })
    await ticket.save()
    
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, ticket, data, msg }
}

it('set ticket.orderId to undefined if orderCancelled event called', async () => {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)

    const orderCancelledTicket = await Ticket.findById(ticket.id)
    expect(orderCancelledTicket!.orderId).not.toBeDefined()
})

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publish a ticket updated event when order cancelled', async () => {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    console.log(ticketUpdatedData)
    expect(ticketUpdatedData.orderId).not.toBeDefined()
})