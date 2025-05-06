import { config } from 'dotenv'
config()
import User from '~/models/schemas/User.schema.js'
import dbService from './database.service.js'
import { RegisterRequestBody } from '~/models/requests/User.requests.js'
import { hashPassword } from '~/utils/crypto.js'
import { signToken } from '~/utils/jwt.js'
import { TokenType } from '~/constants/enums.js'
import RefreshToken from '~/models/schemas/RefreshTokenSchema.js'
import { ObjectId } from 'mongodb'

class UsersService {
  private signAccessToken(user_id: string) {
    const access_token = signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.EXPIRED_IN_ACCESS_TOKEN as StringValue
      }
    })

    return access_token
  }

  private signRefreshToken(user_id: string) {
    const refresh_token = signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.EXPIRED_IN_REFRESH_TOKEN as StringValue
      }
    })

    return refresh_token
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    dbService.refreshTokens.insertOne(new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token }))

    return {
      access_token,
      refresh_token
    }
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
    console.log(user_id)

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    dbService.refreshTokens.insertOne(new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token }))

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
