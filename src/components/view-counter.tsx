"use client";

import { useEffect } from "react";
import { incrementProjectViews } from "@/app/actions";

interface ViewCounterProps {
  projectId: string;
}

export function ViewCounter({ projectId }: ViewCounterProps) {
  useEffect(() => {
    // Set a timeout to increment the view count after 5 seconds
    const timeout = setTimeout(async () => {
      try {
        await incrementProjectViews(projectId);
      } catch (error) {
        console.error("Failed to increment view count:", error);
      }
    }, 5000); // 5 seconds

    // Cleanup timeout if user leaves before 5 seconds
    return () => clearTimeout(timeout);
  }, [projectId]); // Only run once when component mounts

  // This component doesn't render anything
  return null;
}
