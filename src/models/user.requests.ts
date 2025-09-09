import { House } from '@prisma/client'

export interface RegisterReqBody {
  student_id: string
  full_name: string
  phone_number: string
  class_code: string
  company_unit: string
  house: House
}
