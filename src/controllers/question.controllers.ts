import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import questionServices from '~/services/question.services'
import { AnswerReqBody, AttemptReqBody } from '~/models/user.requests'
import attemptServices from '~/services/attempt.services'
import userServices from '~/services/user.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { omit } from 'lodash'

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
      message: 'MSSV không tồn tại, vui lòng đăng ký'
    })
  }

  await attemptServices.checkAttemptExist(student_id)

  const result = await attemptServices.createAttemptWithRandomQuestions(student_id)

  res.status(200).json({
    message: 'Lấy bộ câu hỏi thành công',
    result
  })
}

export const updateAnswerController = async (
  req: Request<ParamsDictionary, any, AnswerReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { attempt_id, question_id } = req.params
  const { option_id } = req.body

  const result = await attemptServices.updateAnswer(attempt_id, question_id, option_id)

  res.status(200).json({
    message: 'Cập nhật đáp án thành công'
  })
}

export const submitController = async (
  req: Request<ParamsDictionary, any, any>, //
  res: Response,
  next: NextFunction
) => {
  const { attempt_id } = req.params

  const result = await attemptServices.submitAttempt(attempt_id)

  res.status(200).json({
    message: 'Nộp bài thành công',
    result: omit(result, ['question_order', 'options_order', 'time_limit_sec'])
  })
}
