import { Prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjectImage } from "@/components/project-image";
import { ViewCounter } from "@/components/view-counter";
import { LikeButton } from "@/components/like-button";
import { RoleType } from "@prisma/client";
import { CommentForm } from "@/components/comment-form";
import { CommentList } from "@/components/comment-list";
import { getUser } from "@/app/actions";

type ProjectWithUser = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  github_url: string;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
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
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
      roleType: RoleType;
      student: {
        roll_no: string;
        class: string;
        academic_year: number;
      } | null;
    };
  }[];
};

async function getProject(id: string): Promise<ProjectWithUser | null> {
  const project = await Prisma.project.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          roleType: true,
          student: {
            select: {
              roll_no: true,
              class: true,
              academic_year: true,
            },
          },
        },
      },
      comments: {
        include: {
          user: {
            include: {
              student: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });
  return project as ProjectWithUser | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  // Await the params object
  const { id } = await params;
  const project = await getProject(id);
  const user = await getUser();
  const userDb = user
    ? await Prisma.userDB.findUnique({
        where: { email: user.email },
      })
    : null;

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <ViewCounter projectId={project.id} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Project Header */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <ProjectImage src={project.thumbnail_url} alt={project.name} />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-purple-400">
                {project.name}
              </h1>
              <Link
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                View on GitHub
              </Link>
            </div>
            <div className="mt-4 text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Created by:</span>
                <span>{project.user.name}</span>
                <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                  {project.user.roleType}
                </span>
              </div>
              {project.user.roleType === "STUDENT" && project.user.student && (
                <div className="space-y-1 pl-4 border-l-2 border-gray-700">
                  <p>Roll No: {project.user.student.roll_no}</p>
                  <p>Class: {project.user.student.class}</p>
                  <p>Year: {project.user.student.academic_year}</p>
                </div>
              )}
              <p>
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-400">
              {project.views}
            </p>
            <p className="text-gray-400">Views</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="flex justify-center">
              <LikeButton
                projectId={project.id}
                initialLikeCount={project.likes}
              />
            </div>
            <p className="text-gray-400">Likes</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-400">
              {project._count.comments}
            </p>
            <p className="text-gray-400">Comments</p>
          </div>
        </div>

        {/* Project Description */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Description
          </h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {project.description}
          </p>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Comments ({project._count.comments})
          </h2>

          <div className="mb-6">
            <CommentForm projectId={project.id} />
          </div>

          {project.comments.length > 0 ? (
            <CommentList
              comments={project.comments}
              currentUserId={userDb?.id}
            />
          ) : (
            <p className="text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
