/**
 * Classe que representa a mensagem descritiva de uma resposta no protocolo GBTP.
 *
 * O campo MESSAGE contém informações sobre o processamento da operação.
 *
 * Validação:
 * - A mensagem não pode ser vazia ou composta apenas por espaços em branco.
 */
export class Message {
  private message: string;

  /**
   * Cria uma nova instância de Message.
   * @param message Mensagem descritiva.
   */
  constructor(message: string) {
    this.message = message;
  }

  /**
   * Retorna o conteúdo da mensagem.
   * @returns Mensagem em formato string.
   */
  public content(): string {
    return this.message;
  }

  /**
   * Valida se a mensagem não está vazia ou composta apenas por espaços.
   * @returns true se válido, false caso contrário.
   */
  validate(): boolean {
    return this.message.trim().length > 0;
  }
}
