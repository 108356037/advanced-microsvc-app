import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError {
    private errorArray: ValidationError[]
    statusCode = 400

    public serializeErrors() {
        const formattedErrors = this.errorArray.map(error => {
            return {message: error.msg, field: error.param}
        })
        return formattedErrors
    }

    constructor(errorArray: ValidationError[]) {
        super('Request validation error')
        this.errorArray = errorArray
        // because we are extending a built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
}