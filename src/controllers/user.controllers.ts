import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqBody, UpdateStudentInfoReqBody } from '~/models/user.requests'
import userServices from '~/services/user.services'

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
  const result = await userServices.updateStudentInfo(req.body)

  res.status(200).json({
    message: 'Cập nhật thông tin thành công',
    result
  })
}
