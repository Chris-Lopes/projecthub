"use client";

import { ProjectCard } from "@/components/project-card";
import { SDGGoal } from "@prisma/client";
import { ProjectSearch } from "@/components/project-search";
import { useEffect, useState } from "react";
import { getProjectsAction } from "@/app/actions";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [selectedSDG, setSelectedSDG] = useState<SDGGoal | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { projects, currentUserId } = await getProjectsAction();
      setProjects(projects);
      setFilteredProjects(projects);
      setCurrentUserId(currentUserId);
    };
    fetchProjects();
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
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
