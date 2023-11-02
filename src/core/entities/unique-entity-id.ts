import { randomUUID } from 'crypto';

export class UniqueEntityId {
  private value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  equals(target: UniqueEntityId) {
    return this.value === target.toString();
  }
}
