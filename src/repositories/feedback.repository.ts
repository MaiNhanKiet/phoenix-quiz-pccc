import { prisma } from '~/services/client'

class FeedbackRepository {
  private model = prisma.eventFeedback
  async createFeedback(student_id: string, comment: string, rating: number) {
    return this.model.create({
      data: {
        student_id,
        comment,
        rating
      }
    })
  }

  async checkFeedbackExist(student_id: string) {
    const result = await this.model.findFirst({
      where: {
        student_id
      }
    })
    return result ? true : false
  }
}

export default FeedbackRepository
