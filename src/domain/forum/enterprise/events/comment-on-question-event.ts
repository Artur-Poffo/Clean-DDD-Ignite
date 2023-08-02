import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { QuestionComment } from '../entities/question-comment'

export class CommentOnQuestionEvent implements DomainEvent {
  public ocurredAt: Date
  public questionComment: QuestionComment
  public questionId: UniqueEntityID

  constructor(questionComment: QuestionComment, questionId: UniqueEntityID) {
    this.questionComment = questionComment
    this.questionId = questionId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.questionComment.id
  }
}
