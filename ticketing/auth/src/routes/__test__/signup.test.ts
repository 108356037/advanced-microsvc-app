import request from 'supertest'
import { app } from '../../app'

it('returns 201 on successful signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
})

it('returns 400 with invalid email or password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'vjeberwoibjrwipbkrwljbior'
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'v'
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

it('returns 400 with duplicate email signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
})

it('Check if cookie is set after signup', async () => {
    const response =  await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    expect(response.get("Set-Cookie")).toBeDefined()    
})