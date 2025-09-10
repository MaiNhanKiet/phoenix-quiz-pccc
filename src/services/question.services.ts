import QuestionRepository from '~/repositories/question.repository'
import { pickRandom, shuffleInPlace } from '~/utils/handler'

class QuestionServices {
  private questionRepository: QuestionRepository

  constructor() {
    this.questionRepository = new QuestionRepository()
  }

  // Lấy toàn bộ câu hỏi + options gốc
  async getAllQuestionsWithOptions() {
    return this.questionRepository.getAllQuestionsWithOptionsRepo()
  }

  // Lấy random n câu hỏi, random luôn đáp án
  async getRandomQuestions(limit = 20) {
    const allQuestions = await this.questionRepository.getAllQuestionsWithOptionsRepo()
    const pickedQuestions = pickRandom(allQuestions, limit)

    // Trộn câu hỏi + trộn options
    const shuffledQuestions = shuffleInPlace(pickedQuestions).map((q) => {
      const shuffledOptions = shuffleInPlace([...q.options]).map((o) => ({
        id: o.id,
        content: o.content
        // Không trả is_correct để tránh lộ đáp án
      }))
      return {
        id: q.id,
        content: q.content,
        order: q.order,
        options: shuffledOptions
      }
    })

    return shuffledQuestions
  }

  async checkCorrectAnswer(question_id: string, option_id: string) {
    return this.questionRepository.getQuestionById(question_id, option_id)
  }
}

const questionServices = new QuestionServices()
export default questionServices
