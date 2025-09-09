import { House } from '@prisma/client'
import { prisma } from '~/services/client'

class StrudentRepository {
  private model = prisma.student

  async checkMSSVExist(student_id: string) {
    return this.model.findUnique({
      where: {
        student_id
      }
    })
  }

  async createStudent({
    student_id,
    full_name,
    phone_number,
    class_code,
    company_unit,
    house
  }: {
    student_id: string
    full_name: string
    phone_number: string
    class_code: string
    company_unit: string
    house: House
  }) {
    return this.model.create({
      data: {
        student_id,
        full_name,
        phone_number,
        class_code,
        company_unit,
        house
      }
    })
  }
}

export default StrudentRepository
