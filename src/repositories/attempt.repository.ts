import { prisma } from '~/services/client'

class AttemptRepository {
  private model = prisma.attempt

  async createAttempt(params: {
    student_id: string
    totalCount: number
    question_order: string[]
    options_order: Record<string, string[]>
    time_limit_sec?: number | null
  }) {
    const { student_id, totalCount, question_order, options_order, time_limit_sec } = params
    return prisma.attempt.create({
      data: {
        student_id,
        status: 'ACTIVE',
        started_at: new Date(),
        time_limit_sec,
        total_count: totalCount,
        question_order: question_order as any,
        options_order: options_order as any
      }
    })
  }

  async createEmptyAnswers(attempt_id: string, question_ids: string[]) {
    if (question_ids.length === 0) return { count: 0 }
    return prisma.attemptAnswer.createMany({
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

export default AttemptRepository
