import express from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { wrapAsync } from './utils/handler'
import cors from 'cors'
import prismaService from './services/prisma.services'
import { registerController } from './controllers/user.controllers'
import { registerValidator } from './middlewares/user.middlewares'
import questionServices from './services/question.services'
import { getRandomQuestionsController } from './controllers/question.controllers'
const app = express()
const port = 3000

app.use(
  cors({
    origin: '*'
  })
)
app.use(express.json())

prismaService.connect()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', registerValidator, wrapAsync(registerController))
app.get('/attempts', wrapAsync(getRandomQuestionsController))

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`\x1b[34mPROJECT OPEN ON PORT: \x1b[31m${port}\x1b[0m`)
})
