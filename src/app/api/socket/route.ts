import { NextRequest } from "next/server";
import { getPusher } from "@/lib/socket-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { channel, event, data } = await req.json();
    const pusher = getPusher();
    await pusher.trigger(channel, event, data);

    return new Response("Event triggered successfully", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    });
  } catch (error) {
    console.error("Pusher error:", error);
    return new Response("Error triggering event", { status: 500 });
  }
}
