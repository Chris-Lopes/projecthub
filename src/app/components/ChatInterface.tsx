"use client";

import { useEffect, useRef, useState } from "react";
import { sendMessage, markMessagesAsRead } from "../actions";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface ChatInterfaceProps {
  chatId: string;
  initialMessages: Message[];
  otherUser: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export default function ChatInterface({
  chatId,
  initialMessages,
  otherUser,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when component mounts
    markMessagesAsRead(chatId);

    // Set up polling to fetch new messages
    const interval = setInterval(async () => {
      // TODO: Implement real-time updates using WebSocket or polling
    }, 5000);

    return () => clearInterval(interval);
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await sendMessage(chatId, newMessage);
      if (!result.error && result.message) {
        setMessages((prev) => [result.message, ...prev]);
        setNewMessage("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center space-x-4 p-4 border-b">
        <Avatar>
          <AvatarImage src={otherUser.image || undefined} />
          <AvatarFallback>
            {otherUser.name?.charAt(0) || otherUser.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">
            {otherUser.name || otherUser.email}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.senderId === session?.user?.id;

          return (
            <div
              key={message.id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[70%] ${
                  isSender ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender.image || undefined} />
                  <AvatarFallback>
                    {message.sender.name?.charAt(0) ||
                      message.sender.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    isSender
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
