import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'


it('return 401 if cookie not set', async() => {
    const id = mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'swagDay',
            price: 99.99
        })
        .expect(401)
})

it('return 404 if ticket id not found', async() => {
    const id = mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'swagDay',
            price: 99.99
        })
        .expect(404)

})

it('return 401 if user does not own ticket', async() => {
    const response = await request(app)
        .post('/api/tickets/newticket')
        .set('Cookie', global.signin())
        .send({
            title: 'swagDay',
            price: 99.99
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'swagDady',
            price: 19.99
        })
        .expect(401) 
})

it('return 400 if provide invaild title', async() => {
    const cookie = global.signin() 

    const response = await request(app)
        .post('/api/tickets/newticket')
        .set('Cookie', cookie)
        .send({
            title: 'swagDay',
            price: 99.99
        })
        .expect(201)

    await request(app)
        .put('/api/tickets/newticket')
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 99.99
        })
        .expect(400)
})

it('return 400 if provide invaild price', async() => {
    const cookie = global.signin() 

    const response = await request(app)
        .post('/api/tickets/newticket')
        .set('Cookie', cookie)
        .send({
            title: 'swagDay',
            price: 99.99
        })
        .expect(201)

    await request(app)
        .put('/api/tickets/newticket')
        .set('Cookie', cookie)
        .send({
            title: 'bbDay',
            price: -99
        })
        .expect(400)
})



it('return 200 if provide vaild title/price and owned ticket', async() => {
    const cookie = global.signin() 
    const testVal = {
        setOne: {
            title: 'swagDay',
            price: 99.99
        },
        setTwo: {
            title: 'swaGGDayV1',
            price: 79.99
        }
    }

    const response = await request(app)
        .post('/api/tickets/newticket')
        .set('Cookie', cookie)
        .send(testVal.setOne)
        .expect(201)

    const updatedTicket = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send(testVal.setTwo)
        .expect(200)

    expect(updatedTicket.body.title).toEqual(testVal.setTwo.title)
    expect(updatedTicket.body.price).toEqual(testVal.setTwo.price)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})