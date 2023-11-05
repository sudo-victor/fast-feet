import { Either, right } from '@/core/errors/either';
import { NotificationRepository } from '../repositories/notification-repository';
import { Notification } from '../../enterprise/entities/notification';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface SendNotificationRequest {
  title: string;
  content: string;
  recipientId: string;
}

type SendNotificationResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotification {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    title,
    content,
    recipientId,
  }: SendNotificationRequest): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      title,
      content,
      recipientId: new UniqueEntityId(recipientId),
    });

    await this.notificationRepository.create(notification);

    return right({
      notification,
    });
  }
}
