"use client";

import { useState, useEffect } from "react";
import { getProjectsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default function ReportsPage() {
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

  const downloadReport = (reportType: string) => {
    // This is a simple CSV generation example
    let csvContent = "";

    switch (reportType) {
      case "projects":
        csvContent = "Name,Creator,Status,Views,Likes,Comments\n";
        projects.forEach((p) => {
          csvContent += `${p.name},${p.user.name},${p.status},${p.views},${p.likes},${p._count.comments}\n`;
        });
        break;
      case "sdg":
        const sdgCounts: any = {};
        projects.forEach((p) => {
          p.sdgGoals.forEach((goal: string) => {
            sdgCounts[goal] = (sdgCounts[goal] || 0) + 1;
          });
        });
        csvContent = "SDG Goal,Project Count\n";
        Object.entries(sdgCounts).forEach(([goal, count]) => {
          csvContent += `${goal},${count}\n`;
        });
        break;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}-report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Reports</h1>
          <p className="text-gray-400">
            Generate and download institutional reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects Report */}
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Projects Report
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Download detailed information about all projects including
              engagement metrics
            </p>
            <Button
              onClick={() => downloadReport("projects")}
              className="w-full bg-purple-700 hover:bg-purple-600"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download Projects Report
            </Button>
          </div>

          {/* SDG Impact Report */}
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              SDG Impact Report
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Analysis of project contributions to different SDG goals
            </p>
            <Button
              onClick={() => downloadReport("sdg")}
              className="w-full bg-purple-700 hover:bg-purple-600"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download SDG Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
