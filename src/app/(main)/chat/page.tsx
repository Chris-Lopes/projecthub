"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getUserChats, getUser } from "@/app/actions";
import { UserCircle } from "lucide-react";

interface Chat {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
  };
  messages: {
    id: string;
    content: string;
    createdAt: Date;
    read: boolean;
  }[];
  _count?: {
    messages: number;
  };
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load current user
        const user = await getUser();
        setCurrentUser(user);

        // Load chats
        const result = await getUserChats();
        if (!result.error && result.chats) {
          setChats(result.chats);
        }
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-4 mt-20">
        <Card className="h-[calc(100vh-8rem)] animate-pulse bg-gray-800/50" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 mt-20">
      <Card className="bg-[#141428]/50 backdrop-blur-sm border-purple-900/50 p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Your Chats</h1>

        <div className="space-y-4">
          {chats.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No chats yet</p>
          ) : (
            chats.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              const otherUser =
                currentUser?.email === chat.sender.email
                  ? chat.receiver
                  : chat.sender;

              return (
                <Link key={chat.id} href={`/chat/${chat.id}`} className="block">
                  <div className="bg-[#1a1a30]/50 hover:bg-[#1a1a30] border border-purple-900/50 rounded-lg p-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <UserCircle className="h-10 w-10 text-purple-400" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {otherUser.name}
                        </h3>
                        {lastMessage && (
                          <p className="text-sm text-gray-400 truncate">
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {lastMessage &&
                            new Date(
                              lastMessage.createdAt
                            ).toLocaleDateString()}
                        </div>
                        <div className="mt-1 text-xs text-white">
                          {chat._count?.messages} messages
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
