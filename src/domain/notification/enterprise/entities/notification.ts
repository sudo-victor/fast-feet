import { Optional } from '@/@types/optional';
import { BaseEntity } from '@/core/entities/base-entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface NotificationProps {
  title: string;
  content: string;
  recipientId: UniqueEntityId;
  readAt?: Date | null;
  createdAt: Date;
}

export class Notification extends BaseEntity<NotificationProps> {
  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get readAt() {
    return this.props.readAt;
  }

  set readAt(readAt: Date) {
    this.props.readAt = readAt;
  }

  static create(
    props: Optional<NotificationProps, 'createdAt' | 'readAt'>,
    id?: UniqueEntityId,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return notification;
  }
}
