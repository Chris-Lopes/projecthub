"use client";

import { useState, useEffect } from "react";
import { getProjectsAction, generateAIReport } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, PieChart, BarChart, Target } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { projects } = await getProjectsAction();
      setProjects(projects);
      setLoading(false);
    }
    fetchData();
  }, []);

  const downloadReport = (reportType: string) => {
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

  const generateReport = async (reportType: string) => {
    try {
      setIsGenerating(true);
      setSelectedReport(reportType);
      const report = await generateAIReport(projects, reportType);
      setAiReport(report);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAIReport = () => {
    if (!aiReport) return;
    const blob = new Blob([aiReport], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedReport}-analysis.md`;
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Projects Report */}
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Projects Analysis
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Comprehensive analysis of project performance metrics and impact
              assessment
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => generateReport("projects")}
                className="flex-1 bg-purple-700 hover:bg-purple-600"
                disabled={isGenerating && selectedReport === "projects"}
              >
                {isGenerating && selectedReport === "projects" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  "Generate Report"
                )}
              </Button>
              <Button
                onClick={() => downloadReport("projects")}
                variant="outline"
                className="bg-[#141428]/80 border-purple-900/50 text-purple-400 hover:bg-purple-900/30 hover:text-purple-300"
              >
                <FileDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* SDG Impact Report */}
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                SDG Impact Analysis
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Analysis of SDG contributions and sustainability impact
              recommendations
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => generateReport("sdg")}
                className="flex-1 bg-purple-700 hover:bg-purple-600"
                disabled={isGenerating && selectedReport === "sdg"}
              >
                {isGenerating && selectedReport === "sdg" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  "Generate Report"
                )}
              </Button>
              <Button
                onClick={() => downloadReport("sdg")}
                variant="outline"
                className="bg-[#141428]/80 border-purple-900/50 text-purple-400 hover:bg-purple-900/30 hover:text-purple-300"
              >
                <FileDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* AI Report Display */}
        {(isGenerating || aiReport) && (
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">
                Generated Report
              </h3>
              {aiReport && (
                <Button
                  onClick={downloadAIReport}
                  className="bg-purple-700 hover:bg-purple-600"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              )}
            </div>

            {isGenerating ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4 bg-purple-900/20" />
                <Skeleton className="h-4 w-full bg-purple-900/20" />
                <Skeleton className="h-4 w-5/6 bg-purple-900/20" />
              </div>
            ) : (
              <div className="overflow-auto max-h-[600px] pr-4 -mr-4">
                <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-400 prose-strong:text-purple-400 prose-li:text-gray-400">
                  <div className="markdown-content">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold mb-4 text-white">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold mt-6 mb-3 text-white">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-medium mt-4 mb-2 text-white">
                            {children}
                          </h3>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-6 my-4 space-y-2">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-400">{children}</li>
                        ),
                        p: ({ children }) => (
                          <p className="mb-4 text-gray-400 leading-relaxed">
                            {children}
                          </p>
                        ),
                        code: ({ children }) => (
                          <code className="bg-purple-900/20 px-1.5 py-0.5 rounded text-pink-400">
                            {children}
                          </code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-purple-500/50 pl-4 italic text-gray-400">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {aiReport || ""}
                    </ReactMarkdown>
                  </div>
                </article>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
