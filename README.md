# Gábio Bank Transaction Protocol (GBTP)

## Objetivo

Este projeto tem como finalidade consolidar os conhecimentos sobre protocolos da camada de aplicação por meio da implementação de uma aplicação cliente-servidor baseada em WebSockets. A proposta é criar uma aplicação bancária simplificada utilizando um protocolo próprio denominado **GBTP**.

OBS: Este projeto contém SOMENTE o Servidor (`gabio-server`). Relacione o Cliente web da implementação do link (https://github.com/watusalen/gbtp-applayer) com o Servidor deste projeto para executar corretamente o código.

## Estrutura do Projeto

```
GBTP/
└── gabio-server/
├── node_modules/                     # Módulos instalados via npm
├── src/                              # Código-fonte da aplicação
│ ├── controllers/                    # Camada de controle (entry point da lógica)
│ │ └── bank-controller.ts
│ ├── models/                         # Definições de entidades e tipos
│ │ └── account.ts
│ ├── protocol/                       # Contratos e protocolos
│ │ ├── entities/
│ │ │ └── gbtp.ts
│ │ └── i-message-protocol.ts
│ ├── services/                       # Camada de serviços (regras de negócio)
│ │ └── bank-service.ts
│ └── ws/                             # Comunicação WebSocket
│ └── websocket-handler.ts
│ └── server.ts
├── accounts.json                     # Dados de contas (mock)
├── package-lock.json                 # Controle de versões exatas das dependências
├── package.json                      # Configurações de dependências e scripts
└── tsconfig.json                     # Arquivo de configuração do TypeScript
```

## Protocolo GBTP

O **GBTP** é um protocolo textual inspirado no CNET. O formato é padronizado tanto para requisições quanto para respostas, permitindo parsing simplificado.

### Formato de Requisição

| Campo           | Descrição                                                  |
|------------------|-------------------------------------------------------------|
| `OPERATION`      | Tipo da operação: `BALANCE`, `DEPOSIT`, `WITHDRAW`, `TRANSFER`. |
| `ACCOUNT_ID`     | Identificador da conta principal.                           |
| `TO_ACCOUNT_ID`  | Identificador da conta de destino (apenas para `TRANSFER`). |
| `VALUE`          | Valor da transação (0 para `BALANCE`).                      |

### Formato de Resposta

| Campo     | Descrição                                                             |
|------------|------------------------------------------------------------------------|
| `STATUS`   | Resultado da operação: `OK` ou `ERROR`.                               |
| `MESSAGE`  | Mensagem descritiva sobre o processamento.                            |
| `BALANCE`  | Saldo atualizado da conta principal (mesmo em caso de erro, se aplicável). |

## Operações Exemplificadas

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

## Como executar

Execute os seguintes comandos (um comando por vez) no terminal:

```
cd gabio-server
npm i
npm run dev
```

---
