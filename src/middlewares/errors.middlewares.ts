import { NextFunction, Request, Response } from 'express'
import omit from 'lodash/omit.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

export const defaultErrorHandle = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
}
