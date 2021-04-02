import { basePublisher, Subjects, TicketCreatedEvent } from '@158fighterss/common'

export class TicketCreatedPublisher extends basePublisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}