import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[]
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

global.signin = () => {

    //create a payload
    const payload = {
        email: "dcc@dcc.com",
        id: "jf3kiokp3g"
    }

    //Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    //Build session Object
    const session = { jwt: token }

    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')

    return [`express:sess=${base64}`]
}