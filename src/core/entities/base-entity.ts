import { UniqueEntityId } from './unique-entity-id';

export abstract class BaseEntity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;

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

  merge<Entity>(source: Partial<Props>) {
    const target = { ...this.props };

    for (const key in source) {
      if (source.hasOwnProperty(key) && source[key]) {
        target[key] = source[key];
      }
    }

    const mergedEntity = new (this.constructor as new (
      props: Props,
      id?: UniqueEntityId,
    ) => Entity)(target, this._id);

    return mergedEntity;
  }
}
