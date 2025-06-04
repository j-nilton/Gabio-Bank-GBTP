/**
 * Classe que representa o identificador de conta no protocolo GBTP.
 *
 * O campo ACCOUNT_ID ou TO_ACCOUNT_ID identifica uma conta principal ou de destino.
 *
 * Validação:
 * - O identificador não pode ser vazio ou composto apenas por espaços em branco.
 * - O identificador deve ser uma string que representa um número válido.
 */
export class ID {
  private id: string;

  /**
   * Cria uma nova instância de ID.
   * @param id Identificador da conta.
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * Retorna o identificador da conta.
   * @returns Identificador em formato string.
   */
  public IDNumber(): string {
    return this.id;
  }

  /**
   * Valida se o identificador não está vazio e é um número válido.
   * @returns true se válido, false caso contrário.
   */
  public validate(): boolean {
    const digit = Number(this.id);
    return this.id.trim().length > 0 && !isNaN(digit);
  }
}
