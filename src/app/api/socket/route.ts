import { initSocketServer } from "@/lib/socket-server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const io = initSocketServer(new Response());
    return new Response("Socket initialized", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
      },
    });
  } catch (error) {
    console.error("Socket initialization error:", error);
    return new Response("Error initializing socket", { status: 500 });
  }
}
