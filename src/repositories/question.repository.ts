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
}

export default QuestionRepository
