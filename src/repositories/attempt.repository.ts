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

  async findAttemptByStudentId(student_id: string) {
    return this.model.findFirst({
      where: {
        student_id
      }
    })
  }

  async findAttemptById(attempt_id: string) {
    return this.model.findUnique({
      where: {
        id: attempt_id
      }
    })
  }

  async updateAttempt(
    attempt_id: string,
    params: { correct_count: number; score: number; status: AttemptStatus; finished_at: Date }
  ) {
    const { correct_count, score, status, finished_at } = params
    return this.model.update({
      where: {
        id: attempt_id
      },
      data: {
        correct_count,
        score,
        status,
        finished_at
      }
    })
  }
}

export default AttemptRepository
