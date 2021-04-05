import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('returns error if the ticket does not exist', async() => {
    const ticketId = mongoose.Types.ObjectId().toHexString()

    await request(app)
        .post('/api/orders/neworder')
        .set('Cookie', global.signin())
        .send({ticketId})
        .expect(404)
})

it('returns error if the ticket is reserved', async() => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    })
    await ticket.save()
    const order = Order.build({
        ticket,
        userId: 'gkogko',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()

    await request(app)
        .post('/api/orders/neworder')
        .set('Cookie', global.signin())
        .send({ticketId: ticket.id})
        .expect(400)
})

it('reserve an ticket', async() => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    })
    await ticket.save()

    await request(app)
        .post('/api/orders/neworder')
        .set('Cookie', global.signin())
        .send({ticketId: ticket.id})
        .expect(201)
})

it.todo('event to nats server')