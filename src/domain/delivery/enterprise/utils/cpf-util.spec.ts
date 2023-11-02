import { CpfUtil } from './cpf-util';

describe('CPF Util', () => {
  it('should be able to remove all symbols from a cpf', () => {
    const result = CpfUtil.removeSymbolsFrom('123.123.123-00');
    expect(result).toEqual('12312312300');
  });

  it('should be able to add cpf mask', () => {
    const result = CpfUtil.addMask('12312312300');
    expect(result).toEqual('123.123.123-00');
  });

  it('should be able to return false for a invalid cpf', () => {
    const result1 = CpfUtil.isValid('12312312300111');
    const result2 = CpfUtil.isValid('123321');
    expect(result1).toEqual(false);
    expect(result2).toEqual(false);
  });

  it('should be able to return true for a valid cpf', () => {
    const result1 = CpfUtil.isValid('18202813700');
    const result2 = CpfUtil.isValid('182.028.137-00');
    expect(result1).toEqual(true);
    expect(result2).toEqual(true);
  });
});
