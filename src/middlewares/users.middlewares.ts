import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages.js'
import dbService from '~/services/database.service.js'
import userService from '~/services/users.services.js'
import { hashPassword } from '~/utils/crypto.js'
import { validate } from '~/utils/validations.js'

export const loginValidator = validate(
  checkSchema({
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
      custom: {
        options: async (value, { req }) => {
          const user = await dbService.users.findOne({ email: value, password: hashPassword(req.body.password) })

          if (user === null) {
            throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
      },
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
      isString: true
    }
  })
)

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      trim: true,
      isLength: {
        options: {
          min: 5,
          max: 100
        },
        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100_CHARACTERS
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      }
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      isLength: {
        options: {
          min: 5,
          max: 100
        },
        errorMessage: USERS_MESSAGES.EMAIL_MUST_BE_A_STRING
      },
      errorMessage: 'Email must be a valid email address',
      custom: {
        options: async (value) => {
          const isEmailExist = await userService.checkEmailExist(value)
          if (isEmailExist) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_FROM_6_TO_50_CHARACTERS
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_6_TO_50_CHARACTERS
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      isString: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
          }
          return true
        }
      }
    },
    date_of_birth: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_IS_REQUIRED
      },
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_A_STRING
      }
    }
  })
)
