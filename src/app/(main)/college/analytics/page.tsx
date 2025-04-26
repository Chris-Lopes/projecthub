"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { getProjectsAction } from "@/app/actions";
import { SDGGoal } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// SDG colors
const chartColors = [
  "#E5243B", // No Poverty (SDG 1)
  "#DDA63A", // Zero Hunger (SDG 2)
  "#4C9F38", // Good Health (SDG 3)
  "#C5192D", // Quality Education (SDG 4)
  "#FF3A21", // Gender Equality (SDG 5)
  "#26BDE2", // Clean Water (SDG 6)
  "#FCC30B", // Affordable Energy (SDG 7)
  "#A21942", // Decent Work (SDG 8)
  "#FD6925", // Industry & Infrastructure (SDG 9)
  "#DD1367", // Reduced Inequalities (SDG 10)
  "#FD9D24", // Sustainable Cities (SDG 11)
  "#BF8B2E", // Responsible Consumption (SDG 12)
  "#3F7E44", // Climate Action (SDG 13)
  "#0A97D9", // Life Below Water (SDG 14)
  "#56C02B", // Life on Land (SDG 15)
  "#00689D", // Peace & Justice (SDG 16)
  "#19486A", // Partnerships (SDG 17)
];

export default function AnalyticsPage() {
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

  // Calculate SDG distribution
  const sdgData = Object.values(SDGGoal).reduce((acc: any, goal) => {
    acc[goal] = projects.filter((p) => p.sdgGoals.includes(goal)).length;
    return acc;
  }, {});

  // Calculate project status distribution
  const statusData = {
    PENDING: projects.filter((p) => p.status === "PENDING").length,
    APPROVED: projects.filter((p) => p.status === "APPROVED").length,
    REJECTED: projects.filter((p) => p.status === "REJECTED").length,
  };

  // Calculate engagement metrics
  const totalViews = projects.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = projects.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = projects.reduce((sum, p) => sum + p._count.comments, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400">
            Track project performance and institutional impact
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <h3 className="text-gray-400 mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-white">{projects.length}</p>
          </div>
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <h3 className="text-gray-400 mb-2">Total Engagement</h3>
            <p className="text-3xl font-bold text-white">
              {totalViews + totalLikes + totalComments}
            </p>
          </div>
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <h3 className="text-gray-400 mb-2">Approval Rate</h3>
            <p className="text-3xl font-bold text-white">
              {projects.length
                ? Math.round((statusData.APPROVED / projects.length) * 100)
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SDG Distribution */}
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              SDG Distribution
            </h3>
            <div className="h-[400px] w-full">
              <Pie
                data={{
                  labels: Object.keys(sdgData),
                  datasets: [
                    {
                      data: Object.values(sdgData),
                      backgroundColor: chartColors,
                      borderWidth: 1,
                      borderColor: "#000000",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      align: "start",
                      labels: {
                        color: "rgb(209 213 219)",
                        padding: 10,
                        usePointStyle: true,
                        pointStyle: "circle",
                        font: {
                          size: 11,
                        },
                      },
                    },
                  },
                  layout: {
                    padding: {
                      right: 60,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Project Status
            </h3>
            <div className="h-[400px] w-full">
              {" "}
              {/* Match the height of pie chart */}
              <Bar
                data={{
                  labels: Object.keys(statusData),
                  datasets: [
                    {
                      data: Object.values(statusData),
                      backgroundColor: [
                        "#FFC107", // Pending - Yellow
                        "#4CAF50", // Approved - Green
                        "#FF5252", // Rejected - Red
                      ],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Add this to fill container
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: "rgb(209 213 219)",
                      },
                      grid: {
                        color: "rgba(107, 114, 128, 0.1)",
                      },
                    },
                    x: {
                      ticks: {
                        color: "rgb(209 213 219)",
                      },
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Top Projects */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Performing Projects
          </h3>
          <div className="grid gap-4">
            {projects
              .sort((a, b) => b.views + b.likes - (a.views + a.likes))
              .slice(0, 5)
              .map((project) => (
                <div
                  key={project.id}
                  className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-400">
                        by {project.user.name}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>👀 {project.views}</span>
                      <span>❤️ {project.likes}</span>
                      <span>💬 {project._count.comments}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {project.sdgGoals.map((goal: SDGGoal) => (
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
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
