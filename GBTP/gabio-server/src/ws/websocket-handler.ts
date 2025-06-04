/**
 * Módulo responsável por lidar com conexões WebSocket e processar mensagens
 * utilizando o protocolo GBTP.
 *
 * Esta classe escuta eventos de mensagem, fechamento e erro do WebSocket,
 * processando requisições recebidas e enviando respostas apropriadas.
 */

import { WebSocket } from "ws";
import { GBTPRequest, GBTPResponse } from "../protocol/gbtp";
import { BankController } from "../controllers/bank-controller";

/**
 * Classe que gerencia a comunicação via WebSocket com o cliente,
 * processando requisições GBTP e enviando respostas.
 */
export class WebSocketHandler {
  // Instância do controlador responsável pelo processamento das requisições.
  private controller = new BankController();

  /**
   * Inicializa o handler e registra os eventos do WebSocket.
   * @param ws Instância do WebSocket conectada ao cliente.
   */
  constructor(private ws: WebSocket) {
    // Evento disparado ao receber uma mensagem do cliente.
    ws.on("message", (data: any) => {
      const raw = data.toString();
      console.log("Mensagem recebida:\n", raw);

      let request: GBTPRequest;
      try {
        // Tenta converter e validar a requisição recebida.
        request = GBTPRequest.fromString(raw);
        request.validate();
      } catch (e: any) {
        // Em caso de erro, envia resposta de erro ao cliente.
        const errResp = new GBTPResponse("ERROR", e.message, "0");
        ws.send(errResp.toString());
        return;
      }

      // Processa a requisição utilizando o controlador.
      const response = this.controller.process(request);

      try {
        // Valida a resposta antes de enviar.
        response.validate();
      } catch (e: any) {
        // Em caso de erro na resposta, envia resposta de erro ao cliente.
        const errResp = new GBTPResponse("ERROR", e.message, "0");
        ws.send(errResp.toString());
        return;
      }

      // Serializa e envia a resposta ao cliente.
      const serialized = response.toString();
      ws.send(serialized);
      console.log("Resposta enviada:\n", serialized);
    });

    // Evento disparado quando o cliente desconecta.
    ws.on("close", () => {
      console.log("Cliente desconectado.");
    });

    // Evento disparado em caso de erro na conexão WebSocket.
    ws.on("error", (err) => {
      console.error("Erro no WebSocket:", err);
    });
  }
}
