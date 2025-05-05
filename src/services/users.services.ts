import User from '~/models/schemas/User.schema.js'
import dbService from './database.service.js'
import { RegisterRequestBody } from '~/models/requests/User.requests.js'
import { hashPassword } from '~/utils/crypto.js'
import { signToken } from '~/utils/jwt.js'
import { TokenType } from '~/constants/enums.js'

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        algorithm: 'HS256',
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN)
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        algorithm: 'HS256',
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN)
      }
    })
  }

  async register(payload: RegisterRequestBody) {
    const result = await dbService.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const user = await dbService.users.findOne({ email })
    return user
  }
}

const userService = new UsersService()
export default userService
