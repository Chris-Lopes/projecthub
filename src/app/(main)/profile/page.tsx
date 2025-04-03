import { getUser } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { ProjectCard } from "@/components/project-card";
import { redirect } from "next/navigation";
import { RoleType, ProjectStatus } from "@prisma/client";
import { SDGGoal } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOutAction, checkIsAdmin } from "@/app/actions";

type ProjectWithRelations = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  github_url: string;
  views: number;
  likes: number;
  status: ProjectStatus;
  sdgGoals: SDGGoal[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    roleType: RoleType;
    student: {
      roll_no: string;
      class: string;
      academic_year: string;
    } | null;
  };
  _count: { comments: number };
};

async function getUserProjects(
  userId: string
): Promise<ProjectWithRelations[]> {
  const projects = await Prisma.project.findMany({
    where: { userId },
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
    orderBy: { createdAt: "desc" },
  });
  return projects as ProjectWithRelations[];
}

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const userDb = await Prisma.userDB.findUnique({
    where: { email: user.email },
    include: {
      student: true,
    },
  });
  if (!userDb) redirect("/sign-in");

  const projects = await getUserProjects(userDb.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-30 pb-10">
      {/* Decorative elements matching landing page */}
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-teal-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="inline-block text-teal-400 font-medium mb-3 bg-teal-500/10 px-3 py-1 rounded-full text-sm">
                Account
              </span>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
            </div>
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="outline"
                className="bg-teal-800 text-slate-300 hover:text-white hover:bg-slate-800/70 border-slate-700 hover:border-teal-500/30 transition-all duration-300"
              >
                Logout <LogOut className="h-5 w-5 ml-2" />
              </Button>
            </form>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-sm">Name</p>
                    <p className="text-white font-medium">{userDb.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-medium">{userDb.email}</p>
                  </div>
                </div>
              </div>

              {userDb.student && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Academic Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Roll Number</p>
                      <p className="text-white font-medium">
                        {userDb.student.roll_no}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Class</p>
                      <p className="text-white font-medium">
                        {userDb.student.class}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Academic Year</p>
                      <p className="text-white font-medium">
                        {userDb.student.academic_year}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">My Projects</h2>
            <a
              href="/projects/new"
              className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Project
            </a>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  currentUserId={userDb.id}
                  showEditButton={true}
                  showStatus={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-8 text-center">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-slate-300 mb-4">
                You haven't created any projects yet.
              </p>
              <a
                href="/projects/new"
                className="text-teal-400 hover:text-teal-300 font-medium hover:underline"
              >
                Create your first project →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
