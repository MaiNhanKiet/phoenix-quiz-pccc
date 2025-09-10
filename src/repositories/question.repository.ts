import { prisma } from '~/services/client'

class QuestionRepository {
  private model = prisma.question

  async getAllQuestionsWithOptionsRepo() {
    return prisma.question.findMany({
      include: {
        options: {
          select: { id: true, order: true, content: true, is_correct: true, question: true }
        }
      }
    })
  }

  async getQuestionById(id: string, option_id: string) {
    return this.model.findUnique({
      where: {
        id
      },
      select: {
        options: {
          where: { id: option_id },
          select: { id: true, content: true, is_correct: true }
        }
      }
    })
  }
}

export default QuestionRepository
