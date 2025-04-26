import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer;

export const getWSS = () => {
  if (!wss) {
    throw new Error("WebSocket Server has not been initialized");
  }
  return wss;
};

export const initSocketServer = () => {
  if ((global as any).wss) {
    wss = (global as any).wss;
    return wss;
  }

  wss = new WebSocketServer({
    port: parseInt(process.env.WS_PORT || "3001"),
  });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.on("message", (message: Buffer) => {
      // Broadcast to all clients
      wss.clients.forEach((client: WebSocket) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  (global as any).wss = wss;
  return wss;
};
