export abstract class ValueObject<Props> {
  protected props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  equals(vo: any) {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
