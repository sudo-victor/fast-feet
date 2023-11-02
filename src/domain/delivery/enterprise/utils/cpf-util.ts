export class CpfUtil {
  static isValid(cpf: string) {
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11) {
      return false;
    }

    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;

    if (digit1 !== parseInt(cpf.charAt(9))) {
      return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    if (digit2 !== parseInt(cpf.charAt(10))) {
      return false;
    }

    return true;
  }

  static removeSymbolsFrom(aCpf: string) {
    return aCpf.replace(/\D/g, '');
  }

  static addMask(aCpf: string) {
    let formattedCpf = aCpf.replace(/\D/g, '');

    formattedCpf = formattedCpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4',
    );

    return formattedCpf;
  }
}
