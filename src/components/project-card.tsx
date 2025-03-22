import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MessageSquare, Pencil } from "lucide-react";
import { RoleType } from "@prisma/client";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    thumbnail_url: string;
    github_url: string;
    views: number;
    likes: number;
    user: {
      id: string;
      name: string;
      roleType: RoleType;
      student: {
        roll_no: string;
        class: string;
        academic_year: number;
      } | null;
    };
    _count: {
      comments: number;
    };
  };
  currentUserId?: string;
  showEditButton?: boolean;
}

export function ProjectCard({
  project,
  currentUserId,
  showEditButton,
}: ProjectCardProps) {
  const isOwner = currentUserId === project.user.id;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <Link href={`/projects/${project.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={project.thumbnail_url}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/projects/${project.id}`}>
            <h3 className="text-xl font-semibold text-purple-400 hover:text-purple-300">
              {project.name}
            </h3>
          </Link>
          {showEditButton && isOwner && (
            <Link
              href={`/projects/${project.id}/edit`}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
              title="Edit project"
            >
              <Pencil className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Creator Info */}
        <div className="text-gray-400 text-sm space-y-1.5 mb-3">
          {project.user.student ? (
            <>
              <div className="flex items-center gap-2">
                <span className="font-medium text-purple-300">
                  {project.user.name}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs">{project.user.student.roll_no}</span>
              </div>
              <div className="text-xs text-gray-500">
                {project.user.student.class} • Year{" "}
                {project.user.student.academic_year}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-purple-300">By {project.user.name}</span>
            </div>
          )}
        </div>

        <p className="text-gray-400 text-sm line-clamp-2">
          {project.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              {project.views} <Eye className="w-4 h-4" />
            </span>
            <span className="flex items-center gap-1">
              {project.likes} <Heart className="w-4 h-4" />
            </span>
            <span className="flex items-center gap-1">
              {project._count.comments} <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <Link
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300"
          >
            GitHub →
          </Link>
        </div>
      </div>
    </div>
  );
}
