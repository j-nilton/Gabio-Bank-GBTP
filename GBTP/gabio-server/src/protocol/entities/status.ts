/**
 * Classe que representa o status de uma resposta no protocolo GBTP.
 *
 * O status indica o resultado da operação:
 * - "OK" para sucesso.
 * - "ERROR" para falha.
 *
 * Validação:
 * - O status deve ser "OK" ou "ERROR".
 */
export class Status {
  status: string;

  /**
   * Cria uma nova instância de Status.
   * @param status Status da operação ("OK" ou "ERROR").
   */
  constructor(status: string) {
    this.status = status.toUpperCase();
  }

  /**
   * Retorna o status da operação.
   * @returns Status em formato string.
   */
  statusMessage(): string {
    return this.status;
  }

  /**
   * Valida se o status é "OK" ou "ERROR".
   * @returns true se válido, false caso contrário.
   */
  validate(): boolean {
    return this.status === "OK" || this.status === "ERROR";
  }
}
