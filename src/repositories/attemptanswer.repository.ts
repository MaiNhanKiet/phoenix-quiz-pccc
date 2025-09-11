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

  async upsertAnswer(attempt_id: string, question_id: string, option_id: string, is_correct: boolean) {
    return this.model.update({
      where: {
        attempt_id_question_id: { attempt_id, question_id }
      },
      data: {
        option_id,
        is_correct,
        answered_at: new Date()
      }
    })
  }

  async findAnswersByAttemptId(attempt_id: string) {
    return this.model.findMany({
      where: {
        attempt_id
      }
    })
  }
}

export default AttemptAnswerRepository
