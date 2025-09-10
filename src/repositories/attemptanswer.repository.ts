import { AttemptStatus } from '@prisma/client'
import { prisma } from '~/services/client'

class AttemptAnswerRepository {
  private model = prisma.attemptAnswer

  async createEmptyAnswers(attempt_id: string, question_ids: string[]) {
    if (question_ids.length === 0) return { count: 0 }
    return this.model.createMany({
      data: question_ids.map((qid) => ({
        attempt_id: attempt_id,
        question_id: qid,
        option_id: null,
        is_correct: null,
        answered_at: null
      }))
    })
  }
}

export default AttemptAnswerRepository
