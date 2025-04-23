import { initSocket, NextApiResponseServerIO } from "@/lib/socket";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponseServerIO) {
  try {
    const io = initSocket(res);
    return new Response("Socket initialized", { status: 200 });
  } catch (error) {
    console.error("Socket initialization error:", error);
    return new Response("Error initializing socket", { status: 500 });
  }
}
