import { UniqueEntityId } from './unique-entity-id';

export class BaseEntity<Props> {
  private _id: UniqueEntityId;
  private props: Props;

  get id() {
    return this._id;
  }

  constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  equals(target: BaseEntity<any>) {
    if (target === this) {
      return true;
    }

    if (target.id.equals(this._id)) {
      return true;
    }

    return false;
  }
}
