"use client";

import { useState, useEffect } from "react";
import { getProjectsAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";

export default function IndustryPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-3xl font-bold text-white mb-4">
            Industry Engagement
          </h1>
          <p className="text-gray-400">
            Connect projects with industry opportunities
          </p>
        </div>

        <div className="grid gap-6">
          {approvedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-400">{project.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-900/30 text-purple-300 border-purple-700/50"
                  >
                    {project._count.comments} Interactions
                  </Badge>
                  <span className="text-sm text-gray-400">
                    {project.views} Views • {project.likes} Likes
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
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

              <div className="border-t border-purple-900/30 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Project Creator
                </h4>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white">{project.user.name}</p>
                    {project.user.student && (
                      <p className="text-sm text-gray-400">
                        {project.user.student.roll_no} •{" "}
                        {project.user.student.class}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
