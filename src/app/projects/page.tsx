import { Prisma } from "@/lib/prismaClient";
import { ProjectCard } from "@/components/project-card";
import { getUser } from "@/app/actions";
import { ProjectStatus } from "@prisma/client";

async function getProjects() {
  const user = await getUser();
  const userDb = user
    ? await Prisma.userDB.findUnique({
        where: { email: user.email },
      })
    : null;

  const projects = await Prisma.project.findMany({
    where: {
      OR: [
        { status: ProjectStatus.APPROVED },
        // Show all projects for admin
        user?.email === process.env.ADMIN_USER_EMAIL
          ? {}
          : // Show user's own projects and collaborations
          userDb
          ? {
              OR: [
                { userId: userDb.id },
                {
                  collaborators: {
                    some: { userId: userDb.id },
                  },
                },
              ],
            }
          : undefined,
      ].filter(
        (condition): condition is Exclude<typeof condition, null | undefined> =>
          condition !== null && condition !== undefined
      ),
    },
    include: {
      user: {
        include: {
          student: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { projects, currentUserId: userDb?.id };
}

export default async function ProjectsPage() {
  const { projects, currentUserId } = await getProjects();

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-purple-400 mb-8">
          Featured Projects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
