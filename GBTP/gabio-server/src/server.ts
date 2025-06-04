/**
 * Ponto de entrada do servidor GBTP.
 *
 * Inicializa um WebSocketServer na porta definida, aceita conexões de clientes
 * e delega o tratamento de cada conexão para o WebSocketHandler.
 *
 * Eventos:
 *  - "connection": Novo cliente conectado, instancia um handler para processar mensagens.
 *  - "listening": Servidor pronto para receber conexões.
 *  - "error": Exibe erros do servidor WebSocket.
 */

import { WebSocketServer } from "ws";
import { WebSocketHandler } from "./ws/websocket-handler";

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado.");
  new WebSocketHandler(ws);
});

wss.on("listening", () => {
  console.log(`Servidor GBTP escutando na porta ${PORT}`);
});

wss.on("error", (err) => {
  console.error("Erro no WebSocketServer:", err);
});
