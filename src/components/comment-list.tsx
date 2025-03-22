"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { deleteComment } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    student: {
      roll_no: string;
      class: string;
      academic_year: number;
    } | null;
  };
}

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
}

export function CommentList({ comments, currentUserId }: CommentListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (commentId: string) => {
    if (!currentUserId || isDeleting) return;

    setIsDeleting(commentId);
    setError(null);

    try {
      const result = await deleteComment(commentId);
      if (result.error) {
        setError(result.message);
      } else {
        router.refresh();
      }
    } catch (error) {
      setError("Failed to delete comment");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-300">
                {comment.user.name}
              </span>
              {comment.user.student && (
                <>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">
                    {comment.user.student.roll_no} •{" "}
                    {comment.user.student.class}
                  </span>
                </>
              )}
            </div>
            {currentUserId === comment.user.id && (
              <button
                onClick={() => handleDelete(comment.id)}
                disabled={isDeleting === comment.id}
                className={`text-gray-400 hover:text-red-400 transition-colors ${
                  isDeleting === comment.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                title="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-gray-300">{comment.content}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
