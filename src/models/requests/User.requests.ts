import { JwtPayload } from 'jsonwebtoken'

export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token'
}

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  date_of_birth: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
