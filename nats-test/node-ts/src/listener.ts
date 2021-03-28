import nats, { Message } from 'node-nats-streaming'
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

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('ticket-service')
    const sub = stan.subscribe(
        'ticket:created', 
        'queue-group',
        options)

    sub.on('message', (msg: Message) => {
        console.log(`event ${msg.getSequence()}, content:${msg.getData()}`)
        msg.ack()
    })    
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())