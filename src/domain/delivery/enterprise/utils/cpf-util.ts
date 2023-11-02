export class CpfUtil {
  static isValid(value: string) {
    return /^(?:(?:\d{3}\.){2}\d{3}|\d{9})\d{2}$/.test(value);
  }

  static removeSymbolsFrom(aCpf: string) {
    return aCpf.replace(/\D/g, '');
  }

  static addDotsIn(aCpf: string) {
    let formattedCpf = aCpf.replace(/\D/g, '');

    formattedCpf = formattedCpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4',
    );

    return formattedCpf;
  }
}
