import HTTP_STATUS from '~/constants/httpStatus.js'
import { USERS_MESSAGES } from '~/constants/messages.js'

type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  error: ErrorType
  constructor({ message, error }: { message?: string; error: ErrorType }) {
    super({ message: USERS_MESSAGES.VALIDATION_ERROR, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.error = error
  }
}
