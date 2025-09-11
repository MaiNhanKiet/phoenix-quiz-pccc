import express from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { wrapAsync } from './utils/handler'
import cors from 'cors'
import prismaService from './services/prisma.services'
import { registerController } from './controllers/user.controllers'
import { answerValidator, attemptValidator, registerValidator, submitValidator } from './middlewares/user.middlewares'
import {
  getRandomQuestionsController,
  leaderboardController,
  submitController,
  updateAnswerController
} from './controllers/question.controllers'
import questionServices from './services/question.services'
const app = express()
const port = 3000

app.use(
  cors({
    origin: '*'
  })
)
app.use(express.json())

prismaService.connect()

app.post('/register', registerValidator, wrapAsync(registerController))
app.post('/attempt', attemptValidator, wrapAsync(getRandomQuestionsController))
app.put('/attempt/:attempt_id/answer/:question_id', answerValidator, wrapAsync(updateAnswerController))
app.post('/attempt/:attempt_id/submit', submitValidator, wrapAsync(submitController))
app.get('/top-leaderboard', wrapAsync(leaderboardController))

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`\x1b[34mPROJECT OPEN ON PORT: \x1b[31m${port}\x1b[0m`)
})
