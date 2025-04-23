"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createChat } from "@/app/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ChatInitProps {
  receiverId: string;
  receiverName: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
}

export function ChatInit({
  receiverId,
  receiverName,
  className,
  variant = "default",
}: ChatInitProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initializeChat = async () => {
    startTransition(async () => {
      try {
        const result = await createChat(receiverId);

        if (result.error) {
          toast.error(result.message);
          return;
        }

        if (result.chat) {
          router.push(`/chat/${result.chat.id}`);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to initialize chat");
      }
    });
  };

  return (
    <Button
      onClick={initializeChat}
      disabled={isPending}
      className={className}
      variant={variant}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      {isPending ? "Connecting..." : `Chat with ${receiverName}`}
    </Button>
  );
}
