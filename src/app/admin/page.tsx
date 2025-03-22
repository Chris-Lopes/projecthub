import { getUser, approveProject, rejectProject } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { redirect } from "next/navigation";
import { ProjectStatus } from "@prisma/client";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-purple-400">
            Project Approvals
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              Pending
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Approved
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Rejected
            </div>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 rounded-lg p-6 space-y-4"
              >
                <ProjectCard project={project} showStatus={true} />
                <div className="flex justify-end gap-4">
                  <form
                    action={async () => {
                      "use server";
                      await approveProject(project.id);
                    }}
                  >
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await rejectProject(project.id);
                    }}
                  >
                    <Button type="submit" variant="destructive">
                      Reject
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            No pending projects to review.
          </p>
        )}
      </div>
    </div>
  );
}
