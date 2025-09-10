import { AttemptStatus } from '@prisma/client'
import { prisma } from '~/services/client'

class AttemptRepository {
  private model = prisma.attempt

  async createAttempt(params: {
    student_id: string
    total_count: number
    question_order: string[]
    options_order: Record<string, string[]>
    time_limit_sec?: number | null
  }) {
    const { student_id, total_count, question_order, options_order, time_limit_sec } = params
    return prisma.attempt.create({
      data: {
        student_id,
        status: AttemptStatus.ACTIVE,
        started_at: new Date(),
        total_count,
        question_order: question_order as any,
        options_order: options_order as any
      }
    })
  }
}

export default AttemptRepository
