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
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-400">My Profile</h1>
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="ghost"
                className="text-gray-300 hover:text-gray-100 hover:bg-gray-800"
              >
                Logout <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
          <p className="text-gray-400 mt-2 font-bold">Name: {userDb.name}</p>
          <p className="text-gray-400 mt-2 font-bold">Email: {userDb.email}</p>
          <p className="text-gray-400 mt-2 font-bold">
            Roll No: {userDb.student?.roll_no}
          </p>
          <p className="text-gray-400 mt-2 font-bold">
            Class: {userDb.student?.class}
          </p>
          <p className="text-gray-400 mt-2 font-bold">
            Academic Year: {userDb.student?.academic_year}
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-purple-400 mb-6">
            My Projects
          </h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p className="text-gray-400">
              You haven't created any projects yet.{" "}
              <a
                href="/projects/new"
                className="text-purple-400 hover:underline"
              >
                Create your first project
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
