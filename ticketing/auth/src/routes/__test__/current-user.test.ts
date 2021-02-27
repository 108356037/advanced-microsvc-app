import request from 'supertest'
import { app } from '../../app'

it('check cookie status if exists', async () => {
    const cookie = await global.signUpGetCookie()
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('check if cookie is null if user not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)  
         
    expect(response.body.currentUser).toBeNull()  
})