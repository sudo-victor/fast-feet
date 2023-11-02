import { ValueObject } from '@/core/entities/base-value-object';
import { CpfUtil } from '../../utils/cpf-util';

export interface DocumentValueProps {
  value: string;
  type: 'CPF';
}

export class Document extends ValueObject<DocumentValueProps> {
  private value: DocumentValueProps;

  static createCPF(value: string) {
    if (!CpfUtil.isValid(value)) {
      throw new Error('Invalid CPF');
    }

    return new Document({
      value: CpfUtil.removeSymbolsFrom(value),
      type: 'CPF',
    });
  }
}
