import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('has a route handler listening to /api/tickets for POST', async() => {
    const response =  await request(app)
        .post('/api/tickets/newticket')
        .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async() => {
    await request(app)
        .post('/api/tickets/newticket')
        .send({})
        .expect(401)
})

it('accessed if the user is signed in', async() => {
    await request(app)
        .post('/api/tickets/newticket')
        .set("Cookie", global.signin())
        .send({})
        .expect(400)
})

it('returns an error if an invalid title is provided', async() => {
    await request(app)
        .post('/api/tickets/newticket')
        .set("Cookie", global.signin())
        .send({
            title: '  ',
            price: 999
        })
        .expect(400)
})

it('returns an error if an invalid price is provided', async() => {
    await request(app)
        .post('/api/tickets/newticket')
        .set("Cookie", global.signin())
        .send({
            title: '17play<3',
            price: -999
        })
        .expect(400)   
})

it('create tickets if valid request', async() => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    await request(app)
        .post('/api/tickets/newticket')
        .set("Cookie", global.signin())
        .send({
            title: '17play<3',
            price: 999
        })
        .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
})