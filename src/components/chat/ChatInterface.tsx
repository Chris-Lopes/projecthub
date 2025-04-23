"use client";

import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export function ChatInterface() {
  const { messages, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      await sendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <MessageList messages={messages} />
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
      />
    </div>
  );
}
