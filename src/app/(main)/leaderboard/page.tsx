import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, MessageSquare, Trophy } from "lucide-react";
import { getLeaderboardProjects } from "@/app/actions";

export default async function LeaderboardPage() {
  const { error, projects = [] } = await getLeaderboardProjects();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-28 pb-20">
      {/* Decorative elements */}
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-violet-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <span className="inline-block text-purple-400 font-medium mb-3 bg-purple-500/10 px-3 py-1 rounded-full text-sm">
            Leaderboard
          </span>
          <h1 className="text-3xl font-bold text-white mb-4">
            Top Performing Projects
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Discover the most engaging and impactful projects based on community
            interaction
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block"
            >
              <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6 transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-900/10 hover:shadow-lg relative group">
                {/* Rank Badge */}
                <div className="absolute -left-3 -top-3 w-12 h-12 bg-purple-600/90 rounded-lg flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-all duration-300">
                  <Trophy
                    className={`w-6 h-6 ${
                      index === 0
                        ? "text-yellow-300"
                        : index === 1
                        ? "text-gray-300"
                        : index === 2
                        ? "text-amber-600"
                        : "text-white/80"
                    }`}
                  />
                </div>

                <div className="md:flex items-start gap-6 relative pl-8">
                  {/* Project Image */}
                  <div className="w-full md:w-48 h-32 relative mb-4 md:mb-0 rounded-lg overflow-hidden">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Project Details */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-purple-400 mb-2">
                      {project.name}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Creator Info */}
                    <div className="text-sm text-gray-500 mb-4">
                      By {project.user.name}
                      {project.user.student &&
                        ` • ${project.user.student.roll_no}`}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <Heart className="w-4 h-4" />
                        {project.likes}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Eye className="w-4 h-4" />
                        {project.views}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <MessageSquare className="w-4 h-4" />
                        {project.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {error && (
            <div className="text-center py-10 text-gray-400">
              Failed to load leaderboard data
            </div>
          )}

          {!error && projects.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No projects found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
