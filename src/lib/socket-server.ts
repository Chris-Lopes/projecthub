import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";

let io: ServerIO;

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
};

export const initSocketServer = (res: Response) => {
  if ((global as any).io) {
    io = (global as any).io;
    return io;
  }

  const httpServer = new NetServer((req, res) => {
    res.writeHead(200);
    res.end();
  });

  io = new ServerIO(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  (global as any).io = io;
  return io;
};
