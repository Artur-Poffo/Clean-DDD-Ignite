import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { AnswerComment } from '../entities/answer-comment'

export class CommentOnAnswerEvent implements DomainEvent {
  public ocurredAt: Date
  public answerComment: AnswerComment
  public answerId: UniqueEntityID

  constructor(answerComment: AnswerComment, answerId: UniqueEntityID) {
    this.answerComment = answerComment
    this.answerId = answerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.id
  }
}
