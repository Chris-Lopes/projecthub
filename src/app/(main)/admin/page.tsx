import { getUser, approveProject, rejectProject } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { redirect } from "next/navigation";
import { ProjectStatus } from "@prisma/client";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getPendingProjects() {
  const projects = await Prisma.project.findMany({
    where: { status: "PENDING" },
    include: {
      user: {
        include: {
          student: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects;
}

export default async function AdminPage() {
  const user = await getUser();
  if (!user?.email || user.email !== process.env.ADMIN_USER_EMAIL) {
    redirect("/");
  }

  const projects = await getPendingProjects();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Project Approvals
          </h1>
          <p className="text-gray-400">Review and manage project submissions</p>
        </div>

        {/* Status Legend */}
        <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Status Guide
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
              >
                Pending
              </Badge>
              <span className="text-sm text-gray-400">Awaiting review</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-500/20 text-green-300 border-green-500/50"
              >
                Approved
              </Badge>
              <span className="text-sm text-gray-400">Project accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-red-500/20 text-red-300 border-red-500/50"
              >
                Rejected
              </Badge>
              <span className="text-sm text-gray-400">Project declined</span>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {projects.length > 0 ? (
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6"
              >
                <ProjectCard project={project} showStatus={true} />
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-purple-900/30">
                  <form
                    action={async () => {
                      "use server";
                      await approveProject(project.id);
                      redirect("/admin");
                    }}
                  >
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white border border-green-500/30"
                    >
                      Approve Project
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await rejectProject(project.id);
                      redirect("/admin");
                    }}
                  >
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white border border-red-500/30"
                    >
                      Reject Project
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-12 text-center">
            <p className="text-gray-400">
              No pending projects to review at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
