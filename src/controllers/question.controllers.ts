import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import questionServices from '~/services/question.services'

export const getRandomQuestionsController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const result = await questionServices.getRandomQuestions()

  res.status(200).json({
    message: 'Get random questions successfully',
    result
  })
}
