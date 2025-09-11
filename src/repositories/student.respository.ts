import { Accessory, House, Shirt } from '@prisma/client'
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
    company_unit
  }: {
    student_id: string
    full_name: string
    phone_number: string
    class_code: string
    company_unit: string
  }) {
    return this.model.create({
      data: {
        student_id,
        full_name,
        phone_number,
        class_code,
        company_unit
      }
    })
  }

  async updateStudentInfo({
    student_id,
    house,
    shirt,
    accessory
  }: {
    student_id: string
    house: House
    shirt?: Shirt
    accessory?: Accessory
  }) {
    return this.model.update({
      where: {
        student_id
      },
      data: {
        house,
        ...(shirt && { shirt }),
        ...(accessory && { accessory })
      }
    })
  }
}

export default StrudentRepository
