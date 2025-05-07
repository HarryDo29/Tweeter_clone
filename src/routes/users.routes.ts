import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers.js'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares.js'
import userService from '~/services/users.services.js'
import wrapRequestHandler from '~/utils/handlers.js'

const userRouter = Router()

userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/* Description register a user
  Path: user/register
  Method: POST
  Body:{
    name: string,
    email:string
    password: string
    confirm_password: string
    date_of_birth: ISO8601 (ISOString tiêu chuẩn quốc tế)
    }
*/

userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/*
  Description login a user
  Path: user/login
  Method: POST
  Body:{
    email: string
    password: string
  }
*/

userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
/*
  Description logout a user
  Path: user/logout
  Method: POST
  Headers:{
    Authorization: Bearer <access_token>
  }
  Body:{
    refresh_token: string
  }
*/

userRouter.post('/verify-email')
/*
  Description verify-email
  Path: user/verify-email
  Method: POST
  Body:{
    verify-email-token: string
  }
*/

export default userRouter
