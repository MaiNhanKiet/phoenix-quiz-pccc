import AttemptRepository from '~/repositories/attempt.repository'
import AttemptAnswerRepository from '~/repositories/attemptanswer.repository'
import questionServices from '~/services/question.services'
class AttemptServices {
  private attemptRepository: AttemptRepository
  private attemptAnswerRepository: AttemptAnswerRepository

  constructor() {
    this.attemptRepository = new AttemptRepository()
    this.attemptAnswerRepository = new AttemptAnswerRepository()
  }

  /**
   * Tạo Attempt mới + random câu hỏi/đáp án + snapshot thứ tự
   * Trả về: attemptId + mảng câu hỏi (ẩn is_correct)
   */
  async createAttemptWithRandomQuestions(student_id: string) {
    // 1) Random câu hỏi + options (đã ẩn is_correct trong service câu hỏi)
    const questions = await questionServices.getRandomQuestions(20)

    // 2) Snapshot thứ tự
    const question_order = questions.map((q) => q.id)
    const options_order: Record<string, string[]> = {}
    for (const q of questions) {
      options_order[q.id] = q.options.map((o) => o.id)
    }

    // 3) Tạo Attempt
    const attempt = await this.attemptRepository.createAttempt({
      student_id,
      total_count: questions.length,
      question_order,
      options_order
    })

    // 4) Tạo sẵn bảng Answer rỗng để upsert
    await this.attemptAnswerRepository.createEmptyAnswers(attempt.id, question_order)

    // 5) Trả về FE
    return {
      attemptId: attempt.id,
      questions
    }
  }
}

const attemptServices = new AttemptServices()
export default attemptServices
