import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

let io: ServerIO;

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
};

export const initSocketServer = (res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    io = res.socket.server.io;
    return;
  }

  const httpServer = res.socket.server as any;
  io = new ServerIO(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  res.socket.server.io = io;
};
