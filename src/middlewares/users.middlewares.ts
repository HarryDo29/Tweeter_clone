import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors.js'
import userService from '~/services/users.services.js'
import { validate } from '~/utils/validations.js'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({
      error: 'Missing email or password'
    })
    return
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      trim: true,
      isLength: {
        options: {
          min: 5,
          max: 100
        }
      },
      isString: true,
      errorMessage: 'Name is required and must be between 5-100 characters'
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      isLength: {
        options: {
          min: 5,
          max: 100
        }
      },
      errorMessage: 'Email must be a valid email address',
      custom: {
        options: async (value) => {
          const isEmailExist = await userService.checkEmailExist(value)
          if (isEmailExist) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      },
      isString: true,
      errorMessage: 'Password must be a strong password'
    },
    confirm_password: {
      notEmpty: true,
      isLength: {
        options: { min: 6, max: 50 }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1
        }
      },
      isString: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm password does not match password')
          }
          return true
        }
      },
      errorMessage: 'Confirm password does not match password'
    },
    date_of_birth: {
      notEmpty: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      },
      errorMessage: 'Date of birth is required'
    }
  })
)
