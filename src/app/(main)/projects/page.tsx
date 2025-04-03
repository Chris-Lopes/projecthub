"use client";

import { ProjectCard } from "@/components/project-card";
import { SDGGoal } from "@prisma/client";
import { ProjectSearch } from "@/components/project-search";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProjectsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [selectedSDG, setSelectedSDG] = useState<SDGGoal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    total: number;
    pageCount: number;
    currentPage: number;
  }>({
    total: 0,
    pageCount: 1,
    currentPage: 1,
  });

  const fetchProjects = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const { projects, currentUserId, pagination } = await getProjectsAction(
        page
      );
      setProjects(projects);
      setFilteredProjects(projects);
      setCurrentUserId(currentUserId);
      setPagination(pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(1);
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

  const paginationControls = useMemo(() => {
    if (pagination.pageCount <= 1) return null;

    return (
      <div className="mt-8 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => fetchProjects(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="bg-slate-800/70 hover:bg-slate-700/70 text-white border-slate-700 hover:border-teal-500/30 transition-all duration-300"
        >
          Previous
        </Button>
        <span className="px-4 py-2 text-slate-300 bg-slate-800/50 rounded-md border border-slate-700/50">
          Page {currentPage} of {pagination.pageCount}
        </span>
        <Button
          variant="outline"
          onClick={() => fetchProjects(currentPage + 1)}
          disabled={currentPage === pagination.pageCount || isLoading}
          className="bg-slate-800/70 hover:bg-slate-700/70 text-white border-slate-700 hover:border-teal-500/30 transition-all duration-300"
        >
          Next
        </Button>
      </div>
    );
  }, [currentPage, fetchProjects, isLoading, pagination.pageCount]);

  const projectsList = useMemo(() => {
    if (isLoading) {
      return (
        <div className="col-span-3 text-center py-10 text-slate-400">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-3 w-3 bg-teal-500 rounded-full animate-ping"></div>
            <div className="h-3 w-3 bg-teal-500 rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-3 w-3 bg-teal-500 rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="mt-4">Loading projects...</p>
        </div>
      );
    }

    if (filteredProjects.length === 0) {
      return (
        <div className="col-span-3 text-center py-10 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-slate-500 mb-4"
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
          <p className="text-slate-300 mb-2">No projects found</p>
          <p className="text-slate-400 text-sm">
            Try changing your search criteria or filters
          </p>
        </div>
      );
    }

    // Use map with a stable key pattern
    return filteredProjects.map((project) => (
      <ProjectCard
        key={project.id}
        project={project}
        currentUserId={currentUserId}
      />
    ));
  }, [filteredProjects.length, isLoading, currentUserId, filteredProjects]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-30 pb-10">
      {/* Decorative elements matching landing page */}
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-teal-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10">
          <span className="inline-block text-teal-400 font-medium mb-3 bg-teal-500/10 px-3 py-1 rounded-full text-sm">
            Browse
          </span>
          <h1 className="text-3xl font-bold text-white mb-4">
            Discover Projects
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Explore innovative projects created by our community members
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-6 mb-8">
          <ProjectSearch
            onSearch={handleSearch}
            onSDGChange={handleSDGChange}
            selectedSDG={selectedSDG}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList}
        </div>

        {/* Pagination with updated styling */}
        {paginationControls && (
          <div className="mt-12 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => fetchProjects(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="bg-slate-800/70 hover:bg-slate-700/70 text-white border-slate-700 hover:border-teal-500/30 transition-all duration-300"
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-slate-300 bg-slate-800/50 rounded-md border border-slate-700/50">
              Page {currentPage} of {pagination.pageCount}
            </span>
            <Button
              variant="outline"
              onClick={() => fetchProjects(currentPage + 1)}
              disabled={currentPage === pagination.pageCount || isLoading}
              className="bg-slate-800/70 hover:bg-slate-700/70 text-white border-slate-700 hover:border-teal-500/30 transition-all duration-300"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}