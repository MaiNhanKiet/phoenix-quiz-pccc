import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import { FeedbackReqBody, RegisterReqBody, UpdateStudentInfoReqBody } from '~/models/user.requests'
import userServices from '~/services/user.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userServices.createStudent(req.body)

  res.status(200).json({
    message: 'Đăng kí thành công',
    result
  })
}

export const updateStudentController = async (
  req: Request<ParamsDictionary, any, UpdateStudentInfoReqBody>,
  res: Response,
  next: NextFunction
) => {
  const student = await userServices.checkMSSVExist(req.body.student_id)

  if (!student) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: 'MSSV không tồn tại, vui lòng đăng ký'
    })
  }

  const result = await userServices.updateStudentInfo(req.body)

  res.status(200).json({
    message: 'Cập nhật thông tin thành công',
    result
  })
}

export const feedbackController = async (
  req: Request<ParamsDictionary, any, FeedbackReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { student_id } = req.params
  const { comment, rating } = req.body

  const student = await userServices.checkMSSVExist(student_id)

  if (!student) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: 'MSSV không tồn tại, vui lòng đăng ký'
    })
  }

  const result = await userServices.writeFeedback(student_id, comment, rating)

  res.status(200).json({
    message: 'Ghi đánh giá của sinh viên thành công',
    result
  })
}
