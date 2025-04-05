"use client";

import { useState, useEffect, useCallback } from "react";
import { toggleProjectLike, getProjectLikeStatus } from "@/app/actions";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  projectId: string;
  initialLikeCount: number;
  initialLiked?: boolean;
}

export function LikeButton({
  projectId,
  initialLikeCount,
  initialLiked = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkLikeStatus = async () => {
      try {
        const status = await getProjectLikeStatus(projectId);
        if (mounted) {
          setLiked(status);
        }
      } catch (error) {
        console.error("Failed to check like status:", error);
      }
    };

    checkLikeStatus();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const handleLike = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await toggleProjectLike(projectId);
      if (!result.error) {
        setLiked(result.liked ?? false);
        setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1));
        router.refresh(); // Refresh the page to update the server-side count
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setError("Failed to update like status");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, projectId, router]);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:ring-offset-2 focus:ring-offset-[#141428] rounded-full p-1 transition-all duration-300 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title={error || undefined}
      >
        <Heart
          className={`w-6 h-6 transition-all duration-300 ${
            isLoading ? "animate-pulse" : ""
          } ${
            liked
              ? "fill-purple-500 text-purple-500 hover:fill-purple-400 hover:text-purple-400"
              : "fill-none text-gray-400 hover:text-purple-400"
          }`}
        />
        <span
          className={`text-2xl font-bold transition-colors duration-300 ${
            liked ? "text-purple-500" : "text-gray-400"
          }`}
        >
          {likeCount}
        </span>
      </button>
      {error && (
        <span className="text-xs text-red-400 px-2 py-1 bg-red-900/20 rounded-md text-center">
          {error}
        </span>
      )}
    </div>
  );
}
