import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import questionServices from '~/services/question.services'
import { AttemptReqBody } from '~/models/user.requests'
import attemptServices from '~/services/attempt.services'
import userServices from '~/services/user.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

export const getRandomQuestionsController = async (
  req: Request<ParamsDictionary, any, AttemptReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { student_id } = req.body
  const student = await userServices.checkMSSVExist(student_id)

  if (!student) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: 'MSSV không tồn tại'
    })
  }

  const result = await attemptServices.createAttemptWithRandomQuestions(student_id)

  res.status(200).json({
    message: 'Lấy bộ câu hỏi thành công',
    result
  })
}
