import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'

declare global {
    namespace NodeJS {
        interface Global {
            signUpGetCookie(): Promise<string[]>
        }
    }
}

let mongo: any
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf'
    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()
    
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signUpGetCookie = async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const cookie = response.get('Set-Cookie')
    return cookie
}