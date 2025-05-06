import { Request, Response, NextFunction } from 'express'
import userService from '~/services/users.services.js'
import { ParamsDictionary } from 'express-serve-static-core'
import { LogoutRequestBody, RegisterRequestBody } from '~/models/requests/User.requests.js'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema.js'
import { USERS_MESSAGES } from '~/constants/messages.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  const result = await userService.login(user_id.toString())
  res.status(200).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body)
  res.status(200).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json(result)
}
