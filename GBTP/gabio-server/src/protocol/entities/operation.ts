/**
 * Classe que representa o tipo de operação de uma transação no protocolo GBTP.
 *
 * Tipos permitidos:
 * - "TRANSFER": transferência entre contas.
 * - "WITHDRAW": saque.
 * - "DEPOSIT": depósito.
 * - "BALANCE": consulta de saldo.
 *
 * Validação:
 * - O tipo deve ser um dos valores permitidos.
 */
export class Operation {
  private type: string;

  static ALLOWED_TYPES = ["TRANSFER", "WITHDRAW", "DEPOSIT", "BALANCE"];

  /**
   * Cria uma nova instância de Operation.
   * @param type Tipo da operação.
   */
  constructor(type: string) {
    this.type = type.toUpperCase();
  }

  /**
   * Retorna o tipo da operação.
   * @returns Tipo da operação em formato string.
   */
  public operationType(): string {
    return this.type;
  }

  /**
   * Valida se o tipo da operação é permitido.
   * @returns true se válido, false caso contrário.
   */
  public validate(): boolean {
    return Operation.ALLOWED_TYPES.includes(this.type);
  }
}
