import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { RegisterReqBody, UpdateStudentInfoReqBody } from '~/models/user.requests'
import StrudentRepository from '~/repositories/student.respository'

class UserServices {
  private studentRepository: StrudentRepository

  constructor() {
    this.studentRepository = new StrudentRepository()
  }

  async checkMSSVExist(student_id: string) {
    const result = await this.studentRepository.checkMSSVExist(student_id)
    return result ? true : false
  }

  async createStudent(payload: RegisterReqBody) {
    return this.studentRepository.createStudent(payload)
  }

  async updateStudentInfo(payload: UpdateStudentInfoReqBody) {
    const { student_id, house, accessory, shirt } = payload
    return this.studentRepository.updateStudentInfo({ student_id, house, accessory, shirt })
  }
}

const userServices = new UserServices()
export default userServices
