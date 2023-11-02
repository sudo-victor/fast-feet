export abstract class Encrypter {
  abstract generate(payload): Promise<string>;
}
