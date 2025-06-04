# Gábio Bank Transaction Protocol (GBTP)

## Objetivo

Este projeto tem como finalidade consolidar os conhecimentos sobre protocolos da camada de aplicação por meio da implementação de uma aplicação cliente-servidor baseada em WebSockets. A proposta é criar uma aplicação bancária simplificada utilizando um protocolo próprio denominado **GBTP** (Gábio Bank Transaction Protocol).

## Estrutura do Projeto

- `/gabio-client`: Cliente web desenvolvido com HTML e TypeScript.
- `/gabio-server`: Servidor implementado em Node.js com TypeScript.
- `README.md`: Documentação completa do projeto e especificação do protocolo.

## Protocolo GBTP

O **GBTP** é um protocolo textual inspirado no CNET, baseado em pares `CHAVE:VALOR` separados por nova linha (`\n`). O formato é padronizado tanto para requisições quanto para respostas, permitindo parsing simplificado.

### Formato Comum de Requisição

| Campo           | Descrição                                                  |
|------------------|-------------------------------------------------------------|
| `OPERATION`      | Tipo da operação: `BALANCE`, `DEPOSIT`, `WITHDRAW`, `TRANSFER`. |
| `ACCOUNT_ID`     | Identificador da conta principal.                           |
| `TO_ACCOUNT_ID`  | Identificador da conta de destino (apenas para `TRANSFER`). |
| `VALUE`          | Valor da transação (0 para `BALANCE`).                      |

### Formato Comum de Resposta

| Campo     | Descrição                                                             |
|------------|------------------------------------------------------------------------|
| `STATUS`   | Resultado da operação: `OK` ou `ERROR`.                               |
| `MESSAGE`  | Mensagem descritiva sobre o processamento.                            |
| `BALANCE`  | Saldo atualizado da conta principal (mesmo em caso de erro, se aplicável). |

## Operações Exemplificadas

### Consulta de Saldo (`BALANCE`)

```
Requisição:

OPERATION:BALANCE  
ACCOUNT_ID:1234  
TO_ACCOUNT_ID:  
VALUE:0  

Resposta:

STATUS:OK  
MESSAGE:Saldo consultado com sucesso  
BALANCE:250.00  

Requisição:

OPERATION:DEPOSIT  
ACCOUNT_ID:1234  
TO_ACCOUNT_ID:  
VALUE:100.00  

Resposta:

STATUS:OK  
MESSAGE:Depósito realizado com sucesso  
BALANCE:350.00  

Requisição:

OPERATION:WITHDRAW  
ACCOUNT_ID:1234  
TO_ACCOUNT_ID:  
VALUE:50.00  

Resposta (sucesso):

STATUS:OK  
MESSAGE:Saque efetuado  
BALANCE:300.00  

Resposta (erro - saldo insuficiente):

STATUS:ERROR  
MESSAGE:Saldo insuficiente  
BALANCE:30.00  

Requisição:

OPERATION:TRANSFER  
ACCOUNT_ID:1234  
TO_ACCOUNT_ID:5678  
VALUE:75.00  

Resposta (sucesso):

STATUS:OK  
MESSAGE:Transferência concluída  
BALANCE:225.00  

Resposta (erro - conta de destino inexistente):

STATUS:ERROR  
MESSAGE:Conta de destino inexistente  
BALANCE:225.00  
```

## ⚙️ Requisitos de Implementação

- **Cliente Web**:
  - Desenvolvido com HTML + TypeScript.
  - Interface simples via WebSocket para enviar mensagens no formato GBTP e exibir as respostas.
  
- **Servidor**:
  - Implementado com Node.js + TypeScript.
  - Mantém um mapa em memória (`Map<ID, saldo>`) para as contas.
  - Processa as requisições GBTP e responde conforme a especificação.

- **Inicialização**:
  - Criar contas fictícias (ex.: `1001`, `1002`, `1003`) com saldos iniciais.

- **Validações Obrigatórias**:
  - Todos os campos devem estar presentes.
  - Valores devem ser não-negativos.
  - Contas de origem e destino devem existir (e ser distintas, no caso de transferência).
  - Validação de saldo suficiente para `WITHDRAW` e `TRANSFER`.

## 👥 Organização dos Grupos

- Os estudantes devem formar grupos de **3 integrantes**.
- Cada grupo deverá escolher entre implementar o **cliente (frontend)** ou o **servidor (backend)**.
- A escolha será feita com base em uma ordenação aleatória, respeitando o limite de **5 grupos por função**.

## 📅 Prazo de Entrega

A entrega final está prevista para **04 de junho de 2025** e deve conter:

1. Código-fonte completo de `gabio-client` e `gabio-server`;
2. Arquivo `README.md` com a documentação detalhada do protocolo GBTP;
3. Instruções claras de execução (ex.: `npm install`, `npm start`, etc).

---

**© Disciplina de Redes de Computadores – Maio de 2025**
