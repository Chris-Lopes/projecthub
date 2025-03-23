import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjectImage } from "@/components/project-image";
import { ViewCounter } from "@/components/view-counter";
import { LikeButton } from "@/components/like-button";
import { RoleType, SDGGoal } from "@prisma/client";
import { CommentForm } from "@/components/comment-form";
import { CommentList } from "@/components/comment-list";
import { getUser, getProject } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Prisma } from "@/lib/prismaClient";

// Define SDG goals for server-side rendering
const sdgGoals = [
  { value: SDGGoal.NO_POVERTY, label: "No Poverty", number: 1 },
  { value: SDGGoal.ZERO_HUNGER, label: "Zero Hunger", number: 2 },
  {
    value: SDGGoal.GOOD_HEALTH,
    label: "Good Health and Well-being",
    number: 3,
  },
  { value: SDGGoal.QUALITY_EDUCATION, label: "Quality Education", number: 4 },
  { value: SDGGoal.GENDER_EQUALITY, label: "Gender Equality", number: 5 },
  {
    value: SDGGoal.CLEAN_WATER,
    label: "Clean Water and Sanitation",
    number: 6,
  },
  {
    value: SDGGoal.AFFORDABLE_ENERGY,
    label: "Affordable and Clean Energy",
    number: 7,
  },
  {
    value: SDGGoal.DECENT_WORK,
    label: "Decent Work and Economic Growth",
    number: 8,
  },
  {
    value: SDGGoal.INDUSTRY_INNOVATION,
    label: "Industry, Innovation and Infrastructure",
    number: 9,
  },
  {
    value: SDGGoal.REDUCED_INEQUALITIES,
    label: "Reduced Inequalities",
    number: 10,
  },
  {
    value: SDGGoal.SUSTAINABLE_CITIES,
    label: "Sustainable Cities and Communities",
    number: 11,
  },
  {
    value: SDGGoal.RESPONSIBLE_CONSUMPTION,
    label: "Responsible Consumption and Production",
    number: 12,
  },
  { value: SDGGoal.CLIMATE_ACTION, label: "Climate Action", number: 13 },
  { value: SDGGoal.LIFE_BELOW_WATER, label: "Life Below Water", number: 14 },
  { value: SDGGoal.LIFE_ON_LAND, label: "Life on Land", number: 15 },
  {
    value: SDGGoal.PEACE_JUSTICE,
    label: "Peace, Justice and Strong Institutions",
    number: 16,
  },
  {
    value: SDGGoal.PARTNERSHIPS,
    label: "Partnerships for the Goals",
    number: 17,
  },
] as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  // Await the params object
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

            {/* SDG Goals */}
            {project.sdgGoals && project.sdgGoals.length > 0 && (
              <div className="mt-4">
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
                        className="bg-purple-900/50 text-purple-300 text-xs"
                      >
                        {sdgGoal.number}. {sdgGoal.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

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
