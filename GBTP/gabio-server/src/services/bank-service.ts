/**
 * BankService
 *
 * Responsável pelas regras de negócio de contas em memória:
 * - Consulta de saldo
 * - Depósito
 * - Saque
 * - Transferência
 *
 * Mantém um Map<string, Account> com contas pré-cadastradas.
 */
import { Account } from "../models/account";
import * as fs from "fs";
import * as path from "path";

export class BankService {
  private accounts: Map<string, Account> = new Map();
  private readonly dbPath: string;
  /**
   * Construtor:
   * - Inicializa o caminho absoluto para o arquivo de persistência (accounts.json).
   * - Se accounts.json existir, carrega seu conteúdo no Map de contas.
   * - Caso contrário, cria um arquivo padrão com contas de exemplo e, em seguida, carrega-o.
   *
   * Fluxo:
   * 1. Define `dbPath` apontando para "../../accounts.json" em relação ao __dirname.
   * 2. Verifica se o arquivo existe:
   *    • Se existir, chama `loadFromFile()` para popular o Map de contas.
   *    • Senão, chama `createDefaultAccountsFile()` para criar o JSON inicial e, depois, chama `loadFromFile()`.
   *
   * Essa implementação garante que, a cada inicialização do serviço, as contas
   * sejam carregadas de um arquivo persistente, preservando saldos entre reinícios.
   */
  constructor() {
    this.dbPath = path.resolve(__dirname, "../../accounts.json");
    if (fs.existsSync(this.dbPath)) {
      this.loadFromFile();
    } else {
      this.createDefaultAccountsFile();
      this.loadFromFile();
    }
  }

  /**
   * Carrega o conteúdo de accounts.json para o Map<string, Account>.
   */
  private loadFromFile() {
    const raw = fs.readFileSync(this.dbPath, { encoding: "utf8" });
    const obj = JSON.parse(raw) as Record<string, Account>;
    this.accounts.clear();
    for (const key of Object.keys(obj)) {
      this.accounts.set(key, { id: obj[key].id, balance: obj[key].balance });
    }
  }

  /**
   * Grava o Map<string, Account> atual em accounts.json.
   * Deve ser chamado após qualquer alteração de saldo.
   */
  private saveToFile() {
    const obj: Record<string, Account> = {};
    for (const [key, account] of this.accounts.entries()) {
      obj[key] = { id: account.id, balance: account.balance };
    }
    fs.writeFileSync(this.dbPath, JSON.stringify(obj, null, 2), {
      encoding: "utf8",
    });
  }

  /**
   * Cria um novo arquivo accounts.json com as contas iniciais de exemplo.
   */
  private createDefaultAccountsFile() {
    const defaultAccounts: Record<string, Account> = {
      "1001": { id: "1001", balance: 500.0 },
      "1002": { id: "1002", balance: 1000.0 },
      "1003": { id: "1003", balance: 250.0 },
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(defaultAccounts, null, 2), {
      encoding: "utf8",
    });
  }
  /**
   * getBalance
   *
   * Retorna o saldo atual da conta identificada por accountId.
   *
   * @param accountId - ID da conta de origem
   * @returns saldo atual (number)
   * @throws Error se a conta não existir (mensagem: "Conta de origem inexistente")
   */
  public getBalance(accountId: string): number {
    // Busca a conta pelo ID; lança erro se não existir
    const acc = this.accounts.get(accountId);
    if (!acc) {
      throw new Error("Conta de origem inexistente");
    }
    // Retorna o saldo atual da conta
    return acc.balance;
  }

  /**
   * deposit
   *
   * Adiciona um valor positivo ao saldo da conta.
   *
   * @param accountId - ID da conta de origem
   * @param amount    - Valor a ser depositado (number)
   * @returns saldo atualizado (number)
   * @throws Error se:
   *
   *    • Conta não existir (mensagem: "Conta de origem inexistente")
   *
   *    • amount ≤ 0 (mensagem: "Valor inválido para depósito")
   */
  public deposit(accountId: string, amount: number): number {
    // Busca a conta pelo ID; lança erro se não existir
    const acc = this.accounts.get(accountId);
    if (!acc) {
      throw new Error("Conta de origem inexistente");
    }
    // Verifica se o valor é positivo
    if (amount <= 0) {
      throw new Error("Valor inválido para depósito");
    }
    // Realiza o depósito
    acc.balance += amount;
    // Persiste imediatamente após a alteração
    this.saveToFile();
    return acc.balance;
  }

  /**
   * withdraw
   *
   * Subtrai um valor positivo do saldo da conta.
   *
   * @param accountId - ID da conta de origem
   * @param amount    - Valor a ser sacado (number)
   * @returns saldo atualizado (number)
   * @throws Error se:
   *
   *    • Se a conta não existir (mensagem: "Conta de origem inexistente")
   *
   *    • amount ≤ 0 (mensagem: "Valor inválido para saque")
   *
   *    • amount > saldo atual (mensagem: "Saldo insuficiente")
   */
  public withdraw(accountId: string, amount: number): number {
    // Busca a conta pelo ID; lança erro se não existir
    const acc = this.accounts.get(accountId);
    if (!acc) {
      throw new Error("Conta de origem inexistente");
    }
    // Verifica se o valor é positivo
    if (amount <= 0) {
      throw new Error("Valor inválido para saque");
    }
    // Verifica se há saldo suficiente para o saque
    if (amount > acc.balance) {
      throw new Error("Saldo insuficiente");
    }
    // Realiza o saque
    acc.balance -= amount;
    this.saveToFile();
    return acc.balance;
  }

  /**
   * transfer
   *
   * Transfere um valor positivo de uma conta de origem para uma conta de destino.
   * Verifica também se a conta de destino é diferente da conta de origem.
   *
   * @param sourceId - ID da conta de origem
   * @param destId   - ID da conta de destino
   * @param amount   - Valor a ser transferido (number)
   * @returns saldo atualizado da conta de origem (number)
   * @throws Error se:
   *
   *    • sourceId === destId (mensagem: "Conta de origem e destino não podem ser iguais")
   *
   *    • Se a conta de origem não existir (mensagem: "Conta de origem inexistente")
   *
   *    • Se a conta de destino não existir (mensagem: "Conta de destino inexistente")
   *
   *    • amount ≤ 0 (mensagem: "Valor inválido para transferência")
   *
   *    • amount > saldo da conta de origem (mensagem: "Saldo insuficiente para transferência")
   */
  public transfer(sourceId: string, destId: string, amount: number): number {
    // Verifica se origem e destino são iguais
    // Não permite transferências para a própria conta
    if (sourceId === destId) {
      throw new Error("Conta de origem e destino não podem ser iguais");
    }

    // Busca a conta de origem; lança erro se não existir
    const srcAcc = this.accounts.get(sourceId);
    if (!srcAcc) {
      throw new Error("Conta de origem inexistente");
    }

    // Busca a conta de destino; lança erro se não existir
    const dstAcc = this.accounts.get(destId);
    if (!dstAcc) {
      throw new Error("Conta de destino inexistente");
    }

    // Verifica se o valor é positivo
    if (amount <= 0) {
      throw new Error("Valor inválido para transferência");
    }
    // Verifica se há saldo suficiente na conta de origem
    if (amount > srcAcc.balance) {
      throw new Error("Saldo insuficiente para transferência");
    }

    // Realiza a transferência
    srcAcc.balance -= amount;
    dstAcc.balance += amount;
    // Grava as duas contas no arquivo
    this.saveToFile();
    return srcAcc.balance;
  }
}
