"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, MessageSquare, Trophy } from "lucide-react";
import { getLeaderboardProjects } from "@/app/actions";
import { ProjectSearch } from "@/components/project-search";
import { useState, useEffect, useCallback } from "react";
import { SDGGoal } from "@prisma/client";

export default function LeaderboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [selectedSDG, setSelectedSDG] = useState<SDGGoal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { projects = [] } = await getLeaderboardProjects();
      setProjects(projects);
      setFilteredProjects(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Apply filters whenever search term or SDG selection changes
  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by selected SDG
    if (selectedSDG) {
      filtered = filtered.filter((project) =>
        project.sdgGoals.includes(selectedSDG)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedSDG]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSDGChange = useCallback((goal: SDGGoal | null) => {
    setSelectedSDG(goal);
  }, []);

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

        {/* Search and Filter Section */}
        <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6 mb-8">
          <ProjectSearch
            onSearch={handleSearch}
            onSDGChange={handleSDGChange}
            selectedSDG={selectedSDG}
          />
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-10 text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-3 w-3 bg-purple-500 rounded-full animate-ping"></div>
                <div
                  className="h-3 w-3 bg-purple-500 rounded-full animate-ping"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-3 w-3 bg-purple-500 rounded-full animate-ping"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <p className="mt-4">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-10 bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-300 mb-2">No projects found</p>
              <p className="text-gray-400 text-sm">
                Try changing your search criteria or filters
              </p>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block"
              >
                <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6 transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-900/10 hover:shadow-lg relative group">
                  {/* Rank Badge */}
                  <div className="absolute -left-3 -top-3 w-12 h-12 bg-purple-600/90 rounded-lg flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-all duration-300">
                    <span
                      className={`text-xl font-bold ${
                        index === 0
                          ? "text-yellow-300"
                          : index === 1
                          ? "text-gray-300"
                          : index === 2
                          ? "text-amber-600"
                          : "text-white/80"
                      }`}
                    >
                      {index + 1}
                    </span>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
