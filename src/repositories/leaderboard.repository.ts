import { House } from '@prisma/client'
import { prisma } from '~/services/client'

class LeaderboardRepository {
  private model = prisma.leaderboard

  async createEntry(student_id: string, score: number, total_ms: number) {
    return this.model.create({
      data: {
        student_id,
        score,
        total_ms
      }
    })
  }

  async getTopEntries(limit: number) {
    return this.model.findMany({
      select: {
        student_id: true,
        score: true,
        total_ms: true,
        student: {
          select: {
            full_name: true,
            class_code: true,
            company_unit: true,
            house: true,
            shirt: true,
            accessory: true
          }
        }
      },
      orderBy: [{ score: 'desc' }, { total_ms: 'asc' }],
      take: limit
    })
  }

  async getEntryByStudentId(student_id: string) {
    return this.model.findFirst({
      select: {
        student_id: true,
        score: true,
        total_ms: true,
        student: {
          select: {
            full_name: true,
            class_code: true,
            company_unit: true,
            house: true,
            shirt: true,
            accessory: true
          }
        }
      },
      where: { student_id }
    })
  }
}

export default LeaderboardRepository
