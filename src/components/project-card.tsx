import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MessageSquare, Pencil } from "lucide-react";
import { ProjectStatus, RoleType, SDGGoal } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

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
  [ProjectStatus.PENDING]: "bg-yellow-500",
  [ProjectStatus.APPROVED]: "bg-green-500",
  [ProjectStatus.REJECTED]: "bg-red-500",
};

export function ProjectCard({
  project,
  currentUserId,
  showEditButton,
  showStatus = false,
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
          {showStatus && (
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                  statusColors[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>
          )}
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

        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* SDG Goals */}
        {project.sdgGoals && project.sdgGoals.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
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
