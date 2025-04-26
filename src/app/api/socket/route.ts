import { initSocketServer, NextApiResponseServerIO } from "@/lib/socket-server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponseServerIO) {
  try {
    const io = initSocketServer(res);
    return new Response("Socket initialized", { status: 200 });
  } catch (error) {
    console.error("Socket initialization error:", error);
    return new Response("Error initializing socket", { status: 500 });
  }
}
