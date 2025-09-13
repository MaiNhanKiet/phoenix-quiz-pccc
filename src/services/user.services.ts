import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { RegisterReqBody, UpdateStudentInfoReqBody } from '~/models/user.requests'
import FeedbackRepository from '~/repositories/feedback.repository'
import StrudentRepository from '~/repositories/student.respository'

class UserServices {
  private studentRepository: StrudentRepository
  private feedbackRepository: FeedbackRepository

  constructor() {
    this.studentRepository = new StrudentRepository()
    this.feedbackRepository = new FeedbackRepository()
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

  async writeFeedback(student_id: string, comment: string, rating: number) {
    return this.feedbackRepository.createFeedback(student_id, comment, rating)
  }

  async checkFeedbackExist(student_id: string) {
    return this.feedbackRepository.checkFeedbackExist(student_id)
  }
}

const userServices = new UserServices()
export default userServices
