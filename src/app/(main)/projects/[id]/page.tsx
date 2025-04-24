import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { RoleType, SDGGoal } from "@prisma/client";
import { getUser, getProject, createChat } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Prisma } from "@/lib/prismaClient";
import dynamic from "next/dynamic";
import { Github, Text } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamic imports for better performance
const WebsiteEmbed = dynamic(() => import("@/components/website-embed"), {
  loading: () => (
    <div className="bg-[#141428]/70 h-64 animate-pulse rounded-lg"></div>
  ),
});

const ProjectImage = dynamic(
  () => import("@/components/project-image").then((mod) => mod.ProjectImage),
  {
    loading: () => (
      <div className="bg-[#141428]/70 h-64 animate-pulse rounded-t-lg"></div>
    ),
  }
);

const ViewCounter = dynamic(() =>
  import("@/components/view-counter").then((mod) => mod.ViewCounter)
);
const LikeButton = dynamic(() =>
  import("@/components/like-button").then((mod) => mod.LikeButton)
);
const CommentForm = dynamic(() =>
  import("@/components/comment-form").then((mod) => mod.CommentForm)
);
const CommentList = dynamic(() =>
  import("@/components/comment-list").then((mod) => mod.CommentList)
);

const sdgGoals = [
  { value: SDGGoal.NO_POVERTY, label: "No Poverty", number: 1 },
  { value: SDGGoal.ZERO_HUNGER, label: "Zero Hunger", number: 2 },
  // ... other SDG goals
] as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getProject(id);
  const user = await getUser();
  const userDb = user
    ? await Prisma.userDB.findUnique({
        where: { email: user.email },
      })
    : null;

  if (result.error || !result.project) {
    notFound();
  }

  const project = result.project;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-30 pb-10">
      {/* Decorative elements matching landing page */}
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-violet-500/5 rounded-full blur-3xl" />

      <ViewCounter projectId={project.id} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Project Header */}
        <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-xl overflow-hidden">
          <ProjectImage src={project.thumbnail_url} alt={project.name} />

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-block text-purple-400 font-medium mb-3 bg-purple-500/10 px-3 py-1 rounded-full text-sm">
                  Project
                </span>
                <h1 className="text-3xl font-bold text-white">
                  {project.name}
                </h1>
              </div>
              <div className="flex gap-2">
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                >
                  <Github className="h-5 w-5" />
                  View on GitHub
                </Link>
                {userDb?.roleType === "VIEWER" && (
                  <form
                    action={async () => {
                      "use server";
                      const result = await createChat(project.user.id);
                      if (!result.error && result.chat) {
                        redirect(`/chat/${result.chat.id}`);
                      }
                    }}
                  >
                    <Button
                      type="submit"
                      className="bg-purple-700 hover:bg-purple-600 text-white flex items-center gap-2"
                    >
                      <Text className="h-5 w-5" />
                      Connect
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* SDG Goals */}
            {project.sdgGoals && project.sdgGoals.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  SDG Goals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.sdgGoals.map((goal) => {
                    const sdgGoal = sdgGoals.find((g) => g.value === goal);
                    return sdgGoal ? (
                      <Badge
                        key={goal}
                        variant="outline"
                        className="bg-purple-900/30 text-purple-300 border-purple-700/50 text-xs"
                      >
                        {sdgGoal.number}. {sdgGoal.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 text-gray-300 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">Created by:</span>
                <span>{project.user.name}</span>
                <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                  {project.user.roleType}
                </span>
              </div>
              {project.user.roleType === "STUDENT" && project.user.student && (
                <div className="space-y-1 pl-4 border-l-2 border-purple-900/50">
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141428]/50 backdrop-blur-sm p-4 rounded-xl border border-purple-900/50 shadow-lg text-center group hover:border-purple-500/30 transition-all duration-300">
            <p className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
              {project.views}
            </p>
            <p className="text-gray-400">Views</p>
          </div>
          <div className="bg-[#141428]/50 backdrop-blur-sm p-4 rounded-xl border border-purple-900/50 shadow-lg text-center group hover:border-purple-500/30 transition-all duration-300">
            <div className="flex justify-center">
              <LikeButton
                projectId={project.id}
                initialLikeCount={project.likes}
              />
            </div>
            <p className="text-gray-400">Likes</p>
          </div>
          <div className="bg-[#141428]/50 backdrop-blur-sm p-4 rounded-xl border border-purple-900/50 shadow-lg text-center group hover:border-purple-500/30 transition-all duration-300">
            <p className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
              {project._count.comments}
            </p>
            <p className="text-gray-400">Comments</p>
          </div>
        </div>

        {/* Project Description */}
        <div className="mt-8 bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {project.description}
          </p>
        </div>

        {project && (project as any).website_url && (
          <div className="mt-8 bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Live Demo</h2>
            <WebsiteEmbed
              url={(project as any).website_url}
              title={`${project.name} live preview`}
            />
          </div>
        )}

        {userDb?.roleType === "FACULTY" && project.user.student && (
          <div className="mt-8 bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Feedback</h2>
            <div className="flex justify-between items-center">
              <p className="text-gray-300">
                Please provide your feedback for the project.
              </p>
              <Link
                href={`/feedbacks/${project.user.student.id}`}
                className="inline-flex items-center px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-900/30 border border-purple-500/20 hover:border-purple-500/30"
              >
                <span>Provide Feedback</span>
              </Link>
            </div>
          </div>
        )}
        {/* Comments Section */}
        <div className="mt-8 bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
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
