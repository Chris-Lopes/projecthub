"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectImageProps {
  src: string;
  alt: string;
}

export function ProjectImage({ src, alt }: ProjectImageProps) {
  const [error, setError] = useState(false);

  return (
    <div className="relative h-64 w-full bg-gray-700">
      <Image
        src={
          error
            ? "https://via.placeholder.com/800x400?text=No+Image+Available"
            : src
        }
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        onError={() => setError(true)}
      />
    </div>
  );
}
