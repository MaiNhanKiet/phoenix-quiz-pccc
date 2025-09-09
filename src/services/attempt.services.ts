import AttemptRepository from '~/repositories/attempt.repository'
import questionServices from '~/services/question.services'

export type CreateAttemptInput = {
  student_id: string
  limit?: number
  time_limit_sec?: number | null
}

class AttemptServices {
  private attemptRepository: AttemptRepository

  constructor() {
    this.attemptRepository = new AttemptRepository()
  }

  /**
   * Tạo Attempt mới + random câu hỏi/đáp án + snapshot thứ tự
   * Trả về: attemptId + mảng câu hỏi (ẩn is_correct)
   */
  async createAttemptWithRandomQuestions(input: CreateAttemptInput) {
    const limit = Math.max(1, Math.min(100, Number(input.limit ?? 20)))

    // 1) Random câu hỏi + options (đã ẩn is_correct trong service câu hỏi)
    const questions = await questionServices.getRandomQuestions(limit)

    // 2) Snapshot thứ tự
    const question_order = questions.map((q) => q.id)
    const options_order: Record<string, string[]> = {}
    for (const q of questions) {
      options_order[q.id] = q.options.map((o) => o.id)
    }

    // 3) Tạo Attempt
    const attempt = await this.attemptRepository.createAttempt({
      studentId: input.studentId,
      quizId: input.quizId ?? null,
      totalCount: questions.length,
      question_order,
      options_order,
      timeLimitSec: input.timeLimitSec ?? null
    })

    // 4) (Tuỳ chọn) Tạo sẵn bảng Answer rỗng để upsert cho tiện
    await this.attemptRepository.createEmptyAnswers(attempt._id, question_order)

    // 5) Trả về FE
    return {
      attemptId: attempt._id,
      questions // [{id, content, order, options:[{id, content}]}]
    }
  }
}

const attemptServices = new AttemptServices()
export default attemptServices
