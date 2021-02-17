import { CustomError } from './custom-error'

export class DataBaseConnectionError extends CustomError {
    reason = 'Error connecting to database!'
    statusCode = 500

    serializeErrors() {
        return [{message: this.reason}]
    }

    constructor() {
        super('Db connection error')
        Object.setPrototypeOf(this, DataBaseConnectionError.prototype)
    }


}
