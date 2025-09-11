import { AttemptStatus } from '@prisma/client'
import { at, omit } from 'lodash'
import { ErrorWithStatus } from '~/models/Errors'
import AttemptRepository from '~/repositories/attempt.repository'
import AttemptAnswerRepository from '~/repositories/attemptanswer.repository'
import LeaderboardRepository from '~/repositories/leaderboard.repository'
import questionServices from '~/services/question.services'
class AttemptServices {
  private attemptRepository: AttemptRepository
  private attemptAnswerRepository: AttemptAnswerRepository
  private leaderboardRepository: LeaderboardRepository

  constructor() {
    this.attemptRepository = new AttemptRepository()
    this.attemptAnswerRepository = new AttemptAnswerRepository()
    this.leaderboardRepository = new LeaderboardRepository()
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

  async checkAttemptExist(student_id: string) {
    const attempt = await this.attemptRepository.findAttemptByStudentId(student_id)
    if (attempt) {
      throw new ErrorWithStatus({
        status: 400,
        message: attempt.status === 'ACTIVE' ? 'Bạn đã có bài thi đang làm' : 'Bạn đã hoàn thành bài thi rồi'
      })
    }
  }

  async updateAnswer(attempt_id: string, question_id: string, option_id: string) {
    // kiểm tra option_id của user đã trả lời đúng hay chưa
    const result = await questionServices.checkCorrectAnswer(question_id, option_id)
    if (!result) {
      throw new ErrorWithStatus({
        status: 404,
        message: 'Câu hỏi hoặc đáp án không tồn tại'
      })
    }
    const { is_correct } = result.options[0]
    // cập nhật đáp án vào bảng AttemptAnswer
    return this.attemptAnswerRepository.upsertAnswer(attempt_id, question_id, option_id, is_correct)
  }

  async submitAttempt(attempt_id: string) {
    // thời gian kết thúc
    const finished_at = new Date()
    // kiểm tra attempt tồn tại
    const attempt = await this.attemptRepository.findAttemptById(attempt_id)
    if (!attempt) {
      throw new ErrorWithStatus({
        status: 404,
        message: 'Bài thi không tồn tại'
      })
    }

    if (attempt.status === AttemptStatus.SUBMITTED) {
      throw new ErrorWithStatus({
        status: 400,
        message: 'Bài thi đã được nộp, không thể nộp lại'
      })
    }
    // tính điểm
    const answers = await this.attemptAnswerRepository.findAnswersByAttemptId(attempt_id)
    const correct_count = answers.filter((a) => a.is_correct).length
    const score = (correct_count / attempt.total_count) * 10

    // cập nhật bảng xếp hạng
    await this.leaderboardRepository.createEntry(
      attempt.student_id,
      score,
      finished_at.getTime() - attempt.started_at.getTime()
    )

    // cập nhật attempt
    return this.attemptRepository.updateAttempt(attempt_id, {
      correct_count,
      score,
      status: AttemptStatus.SUBMITTED,
      finished_at
    })
  }

  async getTopLeaderboardEntries() {
    return this.leaderboardRepository.getTopEntries(10)
  }

  async getStudentLeaderboardEntry(student_id: string) {
    return this.leaderboardRepository.getEntryByStudentId(student_id)
  }

  async getAttemptById(attempt_id: string) {
    const attempt = await this.attemptRepository.findAttemptById(attempt_id)
    if (!attempt) {
      throw new ErrorWithStatus({
        status: 404,
        message: 'ID bài thi không tồn tại'
      })
    }
    const answers = await this.attemptAnswerRepository.findAnswersByAttemptId(attempt_id)
    const mapped = answers.map((ans) => ({
      question_id: ans.question_id,
      option_id: ans.option_id
    }))
    return mapped
  }
}

const attemptServices = new AttemptServices()
export default attemptServices
