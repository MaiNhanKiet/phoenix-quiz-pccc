import { ObjectId } from 'mongodb'

interface QuestionType {
  _id?: ObjectId
  question: string
  options: string[]
  correct_answer: string
  topic: string
}

export default class Question {
  _id?: ObjectId
  question: string
  options: string[]
  correct_answer: string
  topic: string

  constructor(question: QuestionType) {
    this._id = question._id || new ObjectId()
    this.question = question.question
    this.options = question.options
    this.correct_answer = question.correct_answer
    this.topic = question.topic
  }
}
