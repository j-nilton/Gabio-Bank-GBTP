/**
 * Interface que representa uma mensagem genérica no protocolo.
 *
 * Implementações desta interface devem fornecer lógica para:
 * - Validar o conteúdo da mensagem.
 * - Serializar a mensagem para uma representação em string.
 */
export interface IMessage {
  /**
   * Valida o conteúdo da mensagem.
   * Deve lançar um erro caso a mensagem seja inválida.
   * @returns {void}
   * @throws {Error} Se a mensagem for inválida.
   */
  validate(): void;

  /**
   * Serializa a mensagem para uma string.
   * @returns {string} Representação da mensagem em formato de string.
   */
  toString(): string;
}
