/**
 * Classe que representa o saldo de uma conta no protocolo GBTP.
 *
 * O campo BALANCE indica o saldo atual da conta principal.
 *
 * Validação:
 * - O saldo deve ser uma string representando um número não negativo.
 * - Não pode ser vazio ou negativo.
 */
export class Balance {
  private balance: string;

  /**
   * Cria uma nova instância de Balance.
   * @param balance Saldo da conta em formato string.
   */
  constructor(balance: string) {
    this.balance = balance;
  }

  /**
   * Retorna o saldo da conta.
   * @returns Saldo em formato string.
   */
  public quantity(): string {
    return this.balance;
  }

  /**
   * Valida se o saldo não está vazio, é um número e não é negativo.
   * @returns true se válido, false caso contrário.
   */
  public validate(): boolean {
    const trimmed = this.balance.trim();
    if (trimmed === "") {
      return false;
    }
    const value = Number(trimmed);
    return !isNaN(value) && value >= 0;
  }
}
