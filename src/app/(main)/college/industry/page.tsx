"use client";

import { useState, useEffect } from "react";
import { getProjectsAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Share, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareModal } from "@/components/share-modal";
import Link from "next/link";

export default function IndustryPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { projects } = await getProjectsAction();
      setProjects(projects);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Get only approved projects
  const approvedProjects = projects.filter((p) => p.status === "APPROVED");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <span className="inline-block text-purple-400 font-medium mb-3 bg-purple-500/10 px-3 py-1 rounded-full text-sm">
            Industry
          </span>
          <h1 className="text-3xl font-bold text-white mb-4">
            Industry Engagement
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Connect promising student projects with industry experts and
            potential collaborators
          </p>
        </div>

        <div className="grid gap-6">
          {approvedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-900/20"
            >
              {/* Project Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white hover:text-purple-400 transition-colors">
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center gap-2"
                      >
                        {project.name}
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </Link>
                    </h3>
                    <p className="text-gray-400 mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* SDG Goals */}
                  <div className="flex flex-wrap gap-2">
                    {project.sdgGoals.map((goal: string) => (
                      <Badge
                        key={goal}
                        variant="outline"
                        className="bg-purple-900/30 text-purple-300 border-purple-700/50"
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>👀 {project.views}</span>
                    <span>❤️ {project.likes}</span>
                    <span>💬 {project._count.comments}</span>
                  </div>
                </div>
              </div>

              {/* Project Creator */}
              <div className="flex justify-between items-end pt-4 border-t border-purple-900/30">
                <div>
                  <p className="text-purple-300 font-medium">
                    {project.user.name}
                  </p>
                  {project.user.student && (
                    <p className="text-sm text-gray-400">
                      {project.user.student.roll_no} •{" "}
                      {project.user.student.class}
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => setSelectedProject(project)}
                  className="bg-purple-700 hover:bg-purple-600 text-white border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 hover:shadow-md hover:shadow-purple-900/20"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share with Industry
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ShareModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </div>
  );
}
