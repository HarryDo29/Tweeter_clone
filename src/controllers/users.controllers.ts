import { Request, Response, NextFunction } from 'express'
import userService from '~/services/users.services.js'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.requests.js'
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email !== 'anhdonguyennhi@gmail.com' || password !== '1223') {
    res.status(202).json({
      message: 'Fail to login'
    })
  }
  res.status(200).json({
    message: 'Login successfully'
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body)
  res.status(200).json({
    message: 'Register success',
    result
  })
}
