/**
 * BankController
 *
 * Responsável por orquestrar as operações bancárias usando BankService e gerar respostas
 * no formato do protocolo GBTP (GBTPResponse).
 */
import { GBTPRequest, GBTPResponse } from "../protocol/gbtp";
import { BankService } from "../services/bank-service";

export class BankController {
  private service = new BankService();

  /**
   * Processa uma requisição GBTPRequest e retorna uma GBTPResponse apropriada.
   *
   * Extrai o tipo de operação, ID da conta de origem, ID da conta de destino (se aplicável)
   * e valor da requisição, chama o BankService para executar a operação e monta a resposta
   * conforme o protocolo GBTP (STATUS, MESSAGE, BALANCE).
   *
   * @param request - Instância de GBTPRequest contendo:
   *   • operation: tipo da operação ("BALANCE", "DEPOSIT", "WITHDRAW", "TRANSFER")
   *   • account: ID da conta de origem
   *   • destination: ID da conta de destino (apenas para "TRANSFER")
   *   • value: valor da transação (string que representa número)
   *
   * @returns GBTPResponse
   *   • STATUS: "OK" ou "ERROR", conforme sucesso ou falha na operação
   *   • MESSAGE: texto descritivo conforme regras do protocolo
   *   • BALANCE: saldo atual da conta de origem (formatado com duas casas decimais)
   *
   * Fluxo:
   * 1. Extrai opType, acctId, destId e valueNum de request.
   * 2. Em bloco try/catch, tenta executar a operação via BankService:
   *    - BALANCE: getBalance(acctId)
   *    - DEPOSIT: deposit(acctId, valueNum)
   *    - WITHDRAW: withdraw(acctId, valueNum)
   *    - TRANSFER: transfer(acctId, destId, valueNum)
   * 3. Se operação bem-sucedida, retorna GBTPResponse("OK", mensagem, saldo).
   * 4. Se ocorrer erro (conta inexistente, saldo insuficiente etc.), captura a exceção:
   *    - Tenta obter saldo atual de acctId (se conta existir), caso contrário usa "0".
   *    - Retorna GBTPResponse("ERROR", mensagem de erro, saldoStr).
   */
  public process(request: GBTPRequest): GBTPResponse {
    const opType = request.operation.operationType();
    const acctId = request.account.IDNumber();
    const destId = request.destination ? request.destination.IDNumber() : "";
    const valueNum = Number(request.value.quantity());

    try {
      let newBalance: number;
      let message: string;

      switch (opType) {
        case "BALANCE":
          // Consulta de saldo
          newBalance = this.service.getBalance(acctId);
          message = "Saldo consultado com sucesso";
          break;

        case "DEPOSIT":
          // Depósito
          newBalance = this.service.deposit(acctId, valueNum);
          message = "Depósito realizado com sucesso";
          break;

        case "WITHDRAW":
          // Saque
          newBalance = this.service.withdraw(acctId, valueNum);
          message = "Saque efetuado";
          break;

        case "TRANSFER":
          // Transferência
          newBalance = this.service.transfer(acctId, destId, valueNum);
          message = "Transferência concluída";
          break;

        default:
          // Caso o tipo de operação seja inválido
          throw new Error("Operação desconhecida");
      }

      // Monta resposta de sucesso com saldo formatado
      return new GBTPResponse("OK", message, newBalance.toFixed(2));
    } catch (err: any) {
      // Em caso de erro (p. ex. conta inexistente, saldo insuficiente etc.)
      let balanceStr = "0";
      try {
        // Se a conta de origem existir, captura o saldo atual
        balanceStr = this.service.getBalance(acctId).toFixed(2);
      } catch {
        // Se a conta não existir, mantemos "0"
      }
      // Retorna resposta de erro com a mensagem da exceção e saldo (se disponível)
      return new GBTPResponse("ERROR", err.message, balanceStr);
    }
  }
}
