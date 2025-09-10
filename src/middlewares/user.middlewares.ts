import { House } from '@prisma/client'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import userServices from '~/services/user.services'
import { validate } from '~/utils/validation'

export const registerValidator = validate(
  checkSchema(
    {
      student_id: {
        notEmpty: {
          errorMessage: 'MSSV không được để trống'
        },
        matches: {
          options: /^(SE|SA|SS)\d{6}$/,
          errorMessage: 'MSSV không đúng định dạng'
        },
        custom: {
          options: async (values) => {
            const rs = await userServices.checkMSSVExist(values)
            if (rs) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: 'MSSV đã tồn tại'
              })
            }
            return true
          }
        }
      },
      full_name: {
        notEmpty: {
          errorMessage: 'Họ và tên không được để trống'
        },
        isString: {
          errorMessage: 'Họ và tên không hợp lệ'
        },
        trim: true,
        isLength: {
          options: {
            min: 2,
            max: 100
          },
          errorMessage: 'Họ và tên không hợp lệ'
        }
      },
      phone_number: {
        notEmpty: {
          errorMessage: 'Số điện thoại không được để trống'
        },
        trim: true,
        custom: {
          options: (value) => {
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
            if (!phoneRegex.test(value)) {
              throw new Error('Số điện thoại không hợp lệ')
            }
            return true
          }
        }
      },
      class_code: {
        notEmpty: {
          errorMessage: 'Lớp không được để trống'
        },
        isLength: {
          options: {
            min: 1,
            max: 6
          },
          errorMessage: 'Lớp không hợp lệ'
        }
      },
      company_unit: {
        notEmpty: {
          errorMessage: 'Đại đội không được để trống'
        },
        isLength: {
          options: {
            min: 1,
            max: 6
          },
          errorMessage: 'Đại đội không hợp lệ'
        }
      },
      house: {
        notEmpty: {
          errorMessage: 'Nhà không được để trống'
        },
        custom: {
          options: async (value) => {
            console.log(value)
            const houseList = Object.values(House)
            if (!houseList.includes(value)) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Nhà không hợp lệ'
              })
            }
          }
        }
      }
    },
    ['body']
  )
)

export const attemptValidator = validate(
  checkSchema(
    {
      student_id: {
        notEmpty: {
          errorMessage: 'MSSV không được để trống'
        },
        matches: {
          options: /^(SE|SA|SS)\d{6}$/,
          errorMessage: 'MSSV không đúng định dạng'
        }
      }
    },
    ['body']
  )
)
