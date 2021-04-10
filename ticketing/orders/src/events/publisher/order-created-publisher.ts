import { basePublisher, OrderCreatedEvent, Subjects } from '@158fighterss/common'

export class OrderCreatedPublisher extends basePublisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}