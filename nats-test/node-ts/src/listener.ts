import nats from 'node-nats-streaming'
import { TicketedCreatedListener } from './events/ticket-created-listener'
import { randomBytes } from 'crypto'

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('listener connected to NATS-Server')

    stan.on('close', () => {
        console.log('NATS connection closed')
        process.exit()
    })

    new TicketedCreatedListener(stan).listen()
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())



