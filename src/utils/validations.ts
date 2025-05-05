import { Request, Response, NextFunction } from 'express'
import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { EntityError, ErrorWithStatus } from '~/models/Errors.js'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await validation.run(req)
    const errors = validationResult(req)
    // ko có lỗi thì next
    if (errors.isEmpty()) {
      return next()
    }
    const errObj = errors.mapped()

    const entityError = new EntityError({ error: {} })
    for (const key in errObj) {
      const { msg } = errObj[key]
      // trả về lỗi ko phải do validate
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.error[key] = errObj[key]
    }
    // nếu có lỗi

    next(entityError)
  }
}
