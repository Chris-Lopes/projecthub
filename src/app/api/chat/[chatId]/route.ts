import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prismaClient";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: { chatId: string } }
) {
  try {
    const chat = await Prisma.chat.findUnique({
      where: { id: context.params.chatId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}
