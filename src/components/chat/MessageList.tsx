"use client";

import { Message } from "./Chat";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
