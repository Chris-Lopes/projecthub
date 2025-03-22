import { getUser } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { ProjectCard } from "@/components/project-card";
import { redirect } from "next/navigation";
import { RoleType } from "@prisma/client";

type ProjectWithRelations = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  github_url: string;
  views: number;
  likes: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    roleType: RoleType;
    student: {
      roll_no: string;
      class: string;
      academic_year: number;
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
  });
  if (!userDb) redirect("/sign-in");

  const projects = await getUserProjects(userDb.id);

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-400">My Profile</h1>
          <p className="text-gray-400 mt-2">{userDb.email}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-purple-400 mb-6">
            My Projects
          </h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
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
