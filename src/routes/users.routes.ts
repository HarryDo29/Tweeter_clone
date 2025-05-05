import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers.js'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares.js'
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

export default userRouter
