import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CommentOnAnswerEvent } from '@/domain/forum/enterprise/events/comment-on-answer-event'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

export class OnCommentInAnswer implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private questionRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      CommentOnAnswerEvent.name,
    )
  }

  private async sendNewAnswerCommentNotification({
    answerId,
    answerComment,
  }: CommentOnAnswerEvent) {
    const answer = await this.answerRepository.findById(answerId.toString())
    const question = await this.questionRepository.findById(
      answer!.questionId.toString(),
    )

    if (answerComment && answer) {
      await this.sendNotification.execute({
        recipientId: answerComment.authorId.toString(),
        title: `Sua resposta recebeu um comentário!`,
        content: `A resposta que você enviou em "${question?.title
          .substring(0, 20)
          .concat('...')}" recebeu um comentário!"`,
      })
    }
  }
}
