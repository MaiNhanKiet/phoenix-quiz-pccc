import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { RegisterReqBody } from '~/models/user.requests'
import StrudentRepository from '~/repositories/student.respository'

class UserServices {
  private studentRepository: StrudentRepository

  constructor() {
    this.studentRepository = new StrudentRepository()
  }

  async checkMSSVExist(student_id: string) {
    const result = await this.studentRepository.checkMSSVExist(student_id)
    if (result) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: 'MSSV đã tồn tại'
      })
    }
    return true
  }

  async createStudent(payload: RegisterReqBody) {
    return this.studentRepository.createStudent(payload)
  }
}

const userServices = new UserServices()
export default userServices
