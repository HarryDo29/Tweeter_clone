import User from './models/schemas/User.schema.ts'
import express from 'express'
declare module 'express' {
  interface Request {
    user: User
  }
}
