import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CommentOnQuestionEvent } from '@/domain/forum/enterprise/events/comment-on-question-event'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

export class OnCommentInQuestion implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      CommentOnQuestionEvent.name,
    )
  }

  private async sendNewQuestionCommentNotification({
    questionId,
    questionComment,
  }: CommentOnQuestionEvent) {
    const question = await this.questionRepository.findById(
      questionId.toString(),
    )

    if (questionComment && question) {
      await this.sendNotification.execute({
        recipientId: questionComment.authorId.toString(),
        title: `Sua pergunta recebeu um comentário!`,
        content: `A pergunta que você enviou em "${question.title
          .substring(0, 20)
          .concat('...')}" recebeu um comentário!"`,
      })
    }
  }
}
