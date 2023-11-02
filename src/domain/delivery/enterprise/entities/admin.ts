import { Optional } from '@/@types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BaseEntity } from 'src/core/entities/base-entity';
import { Document } from './object-values/document';

export interface AdminProps {
  name: string;
  email: string;
  password: string;
  document: Document;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Admin extends BaseEntity<AdminProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get document() {
    return this.props.document;
  }

  set document(document: Document) {
    this.props.document = document;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<AdminProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    const admin = new Admin(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return admin;
  }
}
