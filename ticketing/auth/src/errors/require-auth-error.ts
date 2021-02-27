import { CustomError } from './custom-error'

export class NonAuthorizedError extends CustomError {
    statusCode = 401

    public serializeErrors() {
        return [{message: "Non authorized error"}]
    }

    constructor() {
        super('Non authorized error')
        Object.setPrototypeOf(this, NonAuthorizedError.prototype)
    }
}