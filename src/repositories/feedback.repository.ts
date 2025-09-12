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
}

export default FeedbackRepository
