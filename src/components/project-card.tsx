import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MessageSquare, Pencil } from "lucide-react";
import { ProjectStatus, RoleType, SDGGoal } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { memo } from "react";

// Define SDG goals directly in this file for server-side rendering
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

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    thumbnail_url: string;
    github_url: string;
    views: number;
    likes: number;
    status: ProjectStatus;
    sdgGoals: SDGGoal[];
    user: {
      id: string;
      name: string;
      roleType: RoleType;
      student: {
        roll_no: string;
        class: string;
        academic_year: string;
      } | null;
    };
    _count: {
      comments: number;
    };
  };
  currentUserId?: string;
  showEditButton?: boolean;
  showStatus?: boolean;
}

const statusColors = {
  [ProjectStatus.PENDING]: "bg-yellow-500/80 border-yellow-400/50",
  [ProjectStatus.APPROVED]: "bg-purple-600/80 border-purple-500/50",
  [ProjectStatus.REJECTED]: "bg-red-600/80 border-red-500/50",
};

export const ProjectCard = memo(function ProjectCard({
  project,
  currentUserId,
  showEditButton,
  showStatus = false,
}: ProjectCardProps) {
  const isOwner = currentUserId === project.user.id;

  return (
    <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/30 hover:border-purple-700/50 group">
      <Link
        href={`/projects/${project.id}`}
        className="focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-inset"
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={project.thumbnail_url}
            alt={project.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {showStatus && (
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium text-white border ${
                  statusColors[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Link href={`/projects/${project.id}`} className="group/title">
            <h3 className="text-xl font-semibold text-purple-400 group-hover/title:text-purple-300 transition-colors">
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

        <p className="text-gray-300 text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
          {project.description}
        </p>

        {/* SDG Goals */}
        {project.sdgGoals && project.sdgGoals.length > 0 && (
          <div className="mb-4 min-h-[1.5rem]">
            <div className="flex flex-wrap gap-1.5">
              {project.sdgGoals.slice(0, 2).map((goal) => {
                const sdgGoal = sdgGoals.find((g) => g.value === goal);
                return sdgGoal ? (
                  <Badge
                    key={goal}
                    variant="outline"
                    className="bg-purple-900/30 text-purple-300 border-purple-700/50 text-xs whitespace-nowrap"
                  >
                    {sdgGoal.label}
                  </Badge>
                ) : null;
              })}
              {project.sdgGoals.length > 2 && (
                <Badge
                  variant="outline"
                  className="bg-[#1a1a30]/80 text-gray-300 border-purple-800 text-xs"
                >
                  +{project.sdgGoals.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> {project.views}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-purple-500" /> {project.likes}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> {project._count.comments}
            </span>
          </div>
          <Link
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            GitHub{" "}
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});
