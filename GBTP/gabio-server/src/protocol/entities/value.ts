/**
 * Classe que representa o valor numérico de uma transação no protocolo GBTP.
 *
 * O valor pode ser utilizado em todas as operações do protocolo:
 * - Para BALANCE, o valor deve ser 0.
 * - Para DEPOSIT, WITHDRAW e TRANSFER, o valor deve ser maior que 0.
 *
 * Validação:
 * - O valor deve ser uma string representando um número não negativo.
 * - Não pode ser vazio ou negativo.
 */
export class Value {
  private value: string;

  /**
   * Cria uma nova instância de Value.
   * @param value Valor da transação em formato string.
   */
  constructor(value: string) {
    this.value = value;
  }

  /**
   * Retorna o valor da transação.
   * @returns Valor em formato string.
   */
  public quantity(): string {
    return this.value;
  }

  /**
   * Valida se o valor é um número não negativo e não vazio.
   * @returns true se válido, false caso contrário.
   */
  public validate(): boolean {
    if (this.value.trim() === "") {
      return false;
    }
    const value = Number(this.value);
    return !isNaN(value) && value >= 0;
  }
}
