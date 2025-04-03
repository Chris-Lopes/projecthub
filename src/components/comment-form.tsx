"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createComment } from "@/app/actions";
import { Button } from "@/components/ui/button";

interface CommentFormProps {
  projectId: string;
}

export function CommentForm({ projectId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim()) return;

      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("content", content);
      formData.append("projectId", projectId);

      try {
        const result = await createComment(formData);
        if (result.error) {
          setError(result.message || "Failed to create comment");
        } else {
          setContent("");
          router.refresh();
        }
      } catch (error) {
        setError("Failed to post comment");
      } finally {
        setIsLoading(false);
      }
    },
    [content, projectId, router]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      if (error) setError(null);
    },
    [error]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Add a comment..."
          className="w-full min-h-[6rem] px-4 py-3 text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
          disabled={isLoading}
        />
        <div className="absolute inset-0 rounded-lg pointer-events-none border border-transparent focus-within:border-teal-500/30 focus-within:shadow-sm focus-within:shadow-teal-500/10"></div>
      </div>

      {error && (
        <p className="text-red-400 text-sm p-2 bg-red-900/20 border border-red-700/20 rounded-md">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !content.trim()}
          className={`px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-md transition-all duration-300 hover:shadow-md hover:shadow-teal-900/20 ${
            isLoading || !content.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}
