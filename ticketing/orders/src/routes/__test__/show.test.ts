// import request from 'supertest'
// import { app } from '../../app'
// import mongoose from 'mongoose'

// it('returns error if the ticket does not exist', async() => {
//     const id = mongoose.Types.ObjectId().toHexString()

//     await request(app)
//         .get(`/api/tickets/${id}`)
//         .set('Cookie', global.signin())
//         .send()
//         .expect(404)
// })

// it('returns error if the ticket is reserved', async() => {
//     const title = '17play'
//     const price = 19.9
//     const response =  await request(app)
//         .post('/api/tickets/newticket')
//         .set('Cookie', global.signin())
//         .send({
//             title, price
//         })
//         .expect(201)


//     await request(app)
//         .get(`/api/tickets/${response.body.id}`)
//         .set('Cookie', global.signin())
//         .send()
//         .expect(200)
// })

// it('reserve an ticket', async() => {
//     await request(app)
//         .get(`/api/tickets`)
//         .set('Cookie', global.signin())
//         .send()
//         .expect(200)
// })