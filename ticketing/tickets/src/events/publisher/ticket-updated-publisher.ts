import { basePublisher, Subjects, TicketUpdatedEvent } from '@158fighterss/common'

export class TicketUpdatedPublisher extends basePublisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}