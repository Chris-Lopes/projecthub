"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComment } from "@/app/actions";

interface CommentFormProps {
  projectId: string;
}

export function CommentForm({ projectId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
        setError(result.message);
      } else {
        setContent("");
        router.refresh();
      }
    } catch (error) {
      setError("Failed to post comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full h-24 px-3 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isLoading || !content.trim()}
        className={`px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          isLoading || !content.trim() ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
