import { initSocketServer } from "@/lib/socket-server";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const wss = initSocketServer();
    return new Response("WebSocket Server initialized", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
      },
    });
  } catch (error) {
    console.error("WebSocket initialization error:", error);
    return new Response("Error initializing WebSocket server", { status: 500 });
  }
}
