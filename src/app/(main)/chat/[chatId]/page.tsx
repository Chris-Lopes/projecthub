"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Message } from "@prisma/client";
import {
  sendMessage,
  markMessagesAsRead,
  getChatMessages,
  getUser,
  getDbUser,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle } from "lucide-react";

interface ChatMessage extends Message {
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

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
  messages: ChatMessage[];
}

export default function ChatPage() {
  const { chatId } = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(
    null
  );
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const user = await getDbUser();
      if (user && user.email) {
        setCurrentUser({ email: user.email });
        setCurrentUserName(user.name);
      }
    };
    loadUser();
  }, []);

  // Load chat messages
  const loadChat = async () => {
    try {
      const result = await getChatMessages(chatId as string);
      if (!result.error && result.chat) {
        setChat(result.chat);
        // Scroll to bottom after messages load
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChat();

    // Set up polling for new messages
    const interval = setInterval(loadChat, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [chatId]);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    try {
      await sendMessage({
        chatId: chat.id,
        content: newMessage.trim(),
      });
      setNewMessage("");
      await loadChat(); // Reload messages after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-4 mt-20">
        <Card className="h-[calc(100vh-8rem)] animate-pulse bg-gray-800/50" />
      </div>
    );
  }

  // Chat not found state
  if (!chat) {
    return (
      <div className="container mx-auto max-w-4xl p-4 mt-20">
        <Card className="p-8 text-center bg-[#141428]/50 backdrop-blur-sm border-purple-900/50">
          <p className="text-gray-400">Chat not found</p>
        </Card>
      </div>
    );
  }

  // Determine the other user based on the current user's email
  const otherUser =
    currentUser?.email === chat.sender.email ? chat.receiver : chat.sender;

  return (
    <div className="container mx-auto max-w-4xl p-4 mt-20">
      <Card className="h-[calc(100vh-8rem)] flex flex-col bg-[#141428]/50 backdrop-blur-sm border-purple-900/50">
        {/* Chat Header */}
        <div className="flex-none p-4 border-b border-purple-900/50 flex items-center gap-4">
          <UserCircle className="h-10 w-10 text-purple-400" />
          <div>
            <h2 className="font-semibold text-white">{otherUser.name}</h2>
            <p className="text-sm text-gray-400">
              {chat.messages.length} messages
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 h-0">
          <div className="space-y-4 p-4">
            {chat.messages.map((message) => {
              const isOwnMessage = currentUserName === message.sender.name;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  } items-start gap-2`}
                >
                  {!isOwnMessage && (
                    <UserCircle className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                  )}
                  <div
                    className={`max-w-[70%] rounded-xl p-3 ${
                      isOwnMessage
                        ? "bg-purple-600 text-white ml-auto"
                        : "bg-gray-800 text-gray-200 mr-auto"
                    }`}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs text-purple-400 mb-1">
                        {message.sender.name}
                      </p>
                    )}
                    <p className="break-words text-sm">{message.content}</p>
                    <div className="flex items-center justify-end mt-1 gap-2">
                      <span className="text-[10px] opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                      {isOwnMessage && (
                        <span className="text-[10px] opacity-70">
                          {message.read ? "Read" : "Sent"}
                        </span>
                      )}
                    </div>
                  </div>
                  {isOwnMessage && (
                    <UserCircle className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex-none p-4 border-t border-purple-900/50">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800/50 border-purple-900/50 focus:border-purple-500/50 text-gray-200"
            />
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
