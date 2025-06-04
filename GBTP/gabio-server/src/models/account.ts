/**
 * Modelo que representa uma conta bancária.
 *
 * Cada conta possui um identificador único e um saldo.
 */
export class Account {
  /**
   * Identificador único da conta.
   */
  public id: string;

  /**
   * Saldo atual da conta.
   */
  public balance: number;

  /**
   * Cria uma nova instância de Account.
   * @param id ID da conta
   * @param balance Saldo inicial da conta
   */
  constructor(id: string, balance: number) {
    this.id = id;
    this.balance = balance;
  }
}
