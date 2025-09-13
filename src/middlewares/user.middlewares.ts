import { Accessory, House, Shirt } from '@prisma/client'
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
      }
    },
    ['body']
  )
)

export const updateStudentValidator = validate(
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
      },
      shirt: {
        optional: true,
        custom: {
          options: async (value) => {
            console.log(value)
            const shirtList = Object.values(Shirt)
            if (!shirtList.includes(value)) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Áo không hợp lệ'
              })
            }
          }
        }
      },
      accessory: {
        optional: true,
        custom: {
          options: async (value) => {
            console.log(value)
            const accessoryList = Object.values(Accessory)
            if (!accessoryList.includes(value)) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Phụ kiện không hợp lệ'
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

export const answerValidator = validate(
  checkSchema({
    // attempt_id: {
    //   in: ['params'],
    //   notEmpty: {
    //     errorMessage: 'ID bài thi không được để trống'
    //   },
    //   isUUID: {
    //     errorMessage: 'ID bài thi phải là định dạng UUID'
    //   }
    // },
    // question_id: {
    //   in: ['params'],
    //   notEmpty: {
    //     errorMessage: 'ID câu hỏi không được để trống'
    //   },
    //   isUUID: {
    //     errorMessage: 'ID câu hỏi phải là định dạng UUID'
    //   }
    // },
    // option_id: {
    //   in: ['body'],
    //   notEmpty: {
    //     errorMessage: 'ID câu trả lời không được để trống'
    //   },
    //   isUUID: {
    //     errorMessage: 'ID câu trả lời phải là định dạng UUID'
    //   }
    // }
  })
)

export const submitValidator = validate(
  checkSchema({
    // attempt_id: {
    //   in: ['params'],
    //   notEmpty: {
    //     errorMessage: 'ID bài thi không được để trống'
    //   },
    //   isUUID: {
    //     errorMessage: 'ID bài thi phải là định dạng UUID'
    //   }
    // },
  })
)

export const studentLeaderboardValidator = validate(
  checkSchema({
    student_id: {
      in: ['params'],
      notEmpty: {
        errorMessage: 'MSSV không được để trống'
      },
      matches: {
        options: /^(SE|SA|SS)\d{6}$/,
        errorMessage: 'MSSV không đúng định dạng'
      }
    }
  })
)

export const getAttemptValidator = validate(
  checkSchema({
    attempt_id: {
      in: ['params'],
      notEmpty: {
        errorMessage: 'ID bài thi không được để trống'
      },
      matches: {
        options: /^(SE|SA|SS)\d{6}$/,
        errorMessage: 'MSSV không đúng định dạng'
      }
    }
  })
)

export const feedbackValidator = validate(
  checkSchema({
    student_id: {
      in: ['params'],
      notEmpty: {
        errorMessage: 'MSSV không được để trống'
      },
      matches: {
        options: /^(SE|SA|SS)\d{6}$/,
        errorMessage: 'MSSV không đúng định dạng'
      }
    },
    comment: {
      in: ['body'],
      isString: {
        errorMessage: 'Bình luận không hợp lệ'
      },
      isLength: {
        options: { min: 1, max: 500 },
        errorMessage: 'Bình luận từ 1 đến 500 ký tự'
      }
    },
    rating: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Đánh giá không được để trống'
      },
      isInt: {
        options: { min: 1, max: 5 },
        errorMessage: 'Đánh giá từ 1 đến 5'
      }
    }
  })
)
