import { basePublisher, OrderCancelledEvent, Subjects } from '@158fighterss/common'

export class OrderCancelledPublisher extends basePublisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}