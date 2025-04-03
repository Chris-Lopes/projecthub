"use client";

import { formatDistanceToNow } from "date-fns";
import { useState, useCallback } from "react";
import { deleteComment } from "@/app/actions";
import { Trash2, User } from "lucide-react";
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
      academic_year: string;
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

  const handleDelete = useCallback(
    async (commentId: string) => {
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
    },
    [currentUserId, isDeleting, router]
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-red-900/20 border border-red-700/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-5 border border-slate-700/50 transition-all duration-300 hover:border-slate-600/50 hover:shadow-md hover:shadow-slate-900/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-teal-900/30 rounded-full p-1.5">
                <User className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <span className="font-medium text-teal-300">
                  {comment.user.name}
                </span>
                {comment.user.student && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <span>{comment.user.student.roll_no}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-600"></span>
                    <span>{comment.user.student.class}</span>
                  </div>
                )}
              </div>
            </div>

            {currentUserId === comment.user.id && (
              <button
                onClick={() => handleDelete(comment.id)}
                disabled={isDeleting === comment.id}
                className={`text-slate-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-900/10 ${
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

          <p className="text-slate-300 whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-700/30">
            <p className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
}
