import { Accessory, House, Shirt } from '@prisma/client'

export interface RegisterReqBody {
  student_id: string
  full_name: string
  phone_number: string
  class_code: string
  company_unit: string
}

export interface UpdateStudentInfoReqBody {
  student_id: string
  house: House
  shirt: Shirt
  accessory: Accessory
}

export interface AttemptReqBody {
  student_id: string
}
export interface AnswerReqBody {
  option_id: string
}
