import { CpfUtil } from '../../utils/cpf-util';

export interface DocumentValueProps {
  data: string;
  type: 'CPF';
}

export class Document {
  private value: DocumentValueProps;

  constructor(document: DocumentValueProps) {
    this.value = document;
  }

  toValue() {
    return this.value;
  }

  toString() {
    return CpfUtil.addDotsIn(this.value.data);
  }

  equals(value: string) {
    return CpfUtil.removeSymbolsFrom(value) === this.value.data;
  }

  static createCPF(value: string) {
    if (CpfUtil.isValid(value)) {
      throw new Error('Invalid CPF');
    }

    return new Document({
      data: CpfUtil.removeSymbolsFrom(value),
      type: 'CPF',
    });
  }
}
