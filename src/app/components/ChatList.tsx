"use client";

import { useEffect, useState } from "react";
import { getUserChats } from "../actions";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export default function ChatList() {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const result = await getUserChats();
      if (!result.error) {
        setChats(result.chats);
      }
    };

    fetchChats();
    // Refresh chats every 30 seconds
    const interval = setInterval(fetchChats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Messages</h2>
      <div className="space-y-2">
        {chats.map((chat) => {
          const lastMessage = chat.messages[0];
          const otherUser =
            chat.sender.id === chat.messages[0]?.senderId
              ? chat.receiver
              : chat.sender;

          return (
            <Link key={chat.id} href={`/chat/${chat.id}`} className="block">
              <div className="flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-lg transition-colors">
                <Avatar>
                  <AvatarImage src={otherUser.image || undefined} />
                  <AvatarFallback>
                    {otherUser.name?.charAt(0) || otherUser.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {otherUser.name || otherUser.email}
                    </p>
                    {lastMessage && (
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage?.content || "No messages yet"}
                  </p>
                </div>
                {chat._count.messages > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {chat._count.messages}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
        {chats.length === 0 && (
          <p className="text-center text-gray-500 py-4">No messages yet</p>
        )}
      </div>
    </div>
  );
}
