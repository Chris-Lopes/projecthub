"use client";

import { ProjectCard } from "@/components/project-card";
import { SDGGoal } from "@prisma/client";
import { ProjectSearch } from "@/components/project-search";
import { useEffect, useState } from "react";
import { getProjectsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [selectedSDG, setSelectedSDG] = useState<SDGGoal | null>(null);
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

  const fetchProjects = async (page: number) => {
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
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const handleSearch = (searchTerm: string) => {
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
  };

  const handleSDGChange = (goal: SDGGoal | null) => {
    setSelectedSDG(goal);
    let filtered = projects;

    if (goal) {
      filtered = filtered.filter((project) => project.sdgGoals.includes(goal));
    }

    setFilteredProjects(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-purple-400 mb-8">
          Top Projects
        </h1>
        <ProjectSearch
          onSearch={handleSearch}
          onSDGChange={handleSDGChange}
          selectedSDG={selectedSDG}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 text-center py-10 text-gray-400">
              Loading projects...
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-400">
              No projects found
            </div>
          )}
        </div>

        {pagination.pageCount > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => fetchProjects(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="bg-gray-800 text-gray-300 border-gray-700"
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-gray-300">
              Page {currentPage} of {pagination.pageCount}
            </span>
            <Button
              variant="outline"
              onClick={() => fetchProjects(currentPage + 1)}
              disabled={currentPage === pagination.pageCount || isLoading}
              className="bg-gray-800 text-gray-300 border-gray-700"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
