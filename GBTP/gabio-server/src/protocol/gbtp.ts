import { IMessage } from "./i-message-protocol";
import { Operation } from "./entities/operation";
import { ID } from "./entities/id";
import { Value } from "./entities/value";
import { Status } from "./entities/status";
import { Message } from "./entities/message";
import { Balance } from "./entities/balance";

/**
 * Classe que representa uma requisição do protocolo GBTP.
 *
 * Campos:
 * - operation: tipo da operação (BALANCE, DEPOSIT, WITHDRAW, TRANSFER)
 * - account: identificador da conta principal
 * - destination: identificador da conta de destino (apenas para TRANSFER)
 * - value: valor numérico da transação
 *
 * Validações:
 * - Todos os campos são validados via seus métodos validate().
 * - Para TRANSFER, destination é obrigatório e value > 0.
 * - Para DEPOSIT e WITHDRAW, value > 0.
 * - Para BALANCE, value deve ser 0.
 * - destination só pode ser informado em TRANSFER.
 */
export class GBTPRequest implements IMessage {
  operation: Operation;
  account: ID;
  destination?: ID;
  value: Value;

  /**
   * Cria uma nova requisição GBTP.
   * @param operation Tipo da operação.
   * @param account Conta principal.
   * @param destination Conta de destino (opcional).
   * @param value Valor da transação.
   */
  constructor(
    operation: string,
    account: string,
    destination: string | undefined,
    value: string
  ) {
    this.operation = new Operation(operation);
    this.account = new ID(account);
    this.destination = destination ? new ID(destination) : undefined;
    this.value = new Value(value);
    this.validate();
  }

  /**
   * Cria uma instância de GBTPRequest a partir de uma string formatada.
   * @param request String da requisição.
   * @returns Instância de GBTPRequest.
   */
  static fromString(request: string): GBTPRequest {
    const lines: Array<string> = request.split("\n");
    const operation: string = GBTPRequest.extractValue(
      lines,
      "OPERATION"
    ).toUpperCase();
    const account: string = GBTPRequest.extractValue(lines, "ACCOUNT_ID");
    const destination: string = GBTPRequest.extractValue(
      lines,
      "TO_ACCOUNT_ID"
    );
    const value: string = GBTPRequest.extractValue(lines, "VALUE");
    return new GBTPRequest(operation, account, destination, value);
  }

  /**
   * Extrai o valor de um campo a partir das linhas da requisição.
   * @param lines Linhas da requisição.
   * @param key Chave do campo.
   * @returns Valor do campo.
   * @throws Se a chave não for encontrada.
   */
  static extractValue(lines: Array<string>, key: string): string {
    const line: string | undefined = lines.find((line) => line.startsWith(key));
    if (line) {
      return line.split(":")[1].trim();
    }
    throw new Error(`Chave ${key} não encontrada na requisição.`);
  }

  /**
   * Valida a requisição conforme as regras do protocolo.
   * @throws Se algum campo for inválido.
   */
  validate(): void {
    if (!this.operation.validate()) {
      throw new Error("Operação inválida.");
    }
    if (!this.account.validate()) {
      throw new Error("Conta principal inválida.");
    }
    if (!this.value.validate()) {
      throw new Error("Valor inválido.");
    }

    const op = this.operation.operationType();
    const valueNum = Number(this.value.quantity());

    if (op === "TRANSFER") {
      if (!this.destination || !this.destination.validate()) {
        throw new Error(
          "Conta de destino obrigatória e inválida para transferência."
        );
      }
      if (valueNum <= 0) {
        throw new Error("Valor da transferência deve ser maior que zero.");
      }
      return;
    }

    if (this.destination && this.destination.IDNumber().trim().length > 0) {
      throw new Error(
        "Conta de destino só deve ser informada em transferência."
      );
    }

    if ((op === "DEPOSIT" || op === "WITHDRAW") && valueNum <= 0) {
      throw new Error("Valor deve ser maior que zero para depósito ou saque.");
    }

    if (op === "BALANCE" && valueNum !== 0) {
      throw new Error("Valor deve ser zero para consulta de saldo.");
    }
  }

  /**
   * Serializa a requisição para string no formato do protocolo.
   * @returns String formatada da requisição.
   */
  toString(): string {
    return [
      `OPERATION:${this.operation.operationType()}`,
      `ACCOUNT_ID:${this.account.IDNumber()}`,
      `TO_ACCOUNT_ID:${this.destination ? this.destination.IDNumber() : ""}`,
      `VALUE:${this.value.quantity()}`,
    ].join("\n");
  }
}

/**
 * Classe que representa uma resposta do protocolo GBTP.
 *
 * Campos:
 * - status: resultado da operação (OK ou ERROR)
 * - message: mensagem descritiva sobre o processamento
 * - balance: saldo atual da conta principal
 *
 * Validações:
 * - Todos os campos são validados via seus métodos validate().
 */
export class GBTPResponse implements IMessage {
  status: Status;
  message: Message;
  balance: Balance;

  /**
   * Cria uma nova resposta GBTP.
   * @param status Status da operação.
   * @param message Mensagem descritiva.
   * @param balance Saldo da conta principal.
   */
  constructor(status: string, message: string, balance: string) {
    this.status = new Status(status);
    this.message = new Message(message);
    this.balance = new Balance(balance);
    this.validate();
  }

  /**
   * Cria uma instância de GBTPResponse a partir de uma string formatada.
   * @param response String da resposta.
   * @returns Instância de GBTPResponse.
   */
  static fromString(response: string): GBTPResponse {
    const lines: Array<string> = response.split("\n");
    const status: string = GBTPResponse.extractValue(
      lines,
      "STATUS"
    ).toUpperCase();
    const message: string = GBTPResponse.extractValue(lines, "MESSAGE");
    const balance: string = GBTPResponse.extractValue(lines, "BALANCE");
    return new GBTPResponse(status, message, balance);
  }

  /**
   * Extrai o valor de um campo a partir das linhas da resposta.
   * @param lines Linhas da resposta.
   * @param key Chave do campo.
   * @returns Valor do campo.
   * @throws Se a chave não for encontrada.
   */
  static extractValue(lines: Array<string>, key: string): string {
    const line: string | undefined = lines.find((line) => line.startsWith(key));
    if (line) {
      return line.split(":")[1].trim();
    }
    throw new Error(`Chave ${key} não encontrada na resposta.`);
  }

  /**
   * Valida a resposta conforme as regras do protocolo.
   * @throws Se algum campo for inválido.
   */
  validate(): void {
    if (!this.status.validate()) {
      throw new Error("Status inválido.");
    }
    if (!this.message.validate()) {
      throw new Error("Mensagem inválida.");
    }
    if (!this.balance.validate()) {
      throw new Error("Saldo inválido.");
    }
  }

  /**
   * Serializa a resposta para string no formato do protocolo.
   * @returns String formatada da resposta.
   */
  toString(): string {
    return [
      `STATUS:${this.status.statusMessage()}`,
      `MESSAGE:${this.message.content()}`,
      `BALANCE:${this.balance.quantity()}`,
    ].join("\n");
  }
}
