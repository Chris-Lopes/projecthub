import { getUser } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { redirect } from "next/navigation";
import EditProjectForm from "./edit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;

  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userDb = await Prisma.userDB.findUnique({
    where: { email: user.email },
  });
  if (!userDb) {
    redirect("/sign-in");
  }

  const project = await Prisma.project.findUnique({
    where: { id },
    include: {
      collaborators: {
        include: {
          user: {
            include: {
              student: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    redirect("/profile");
  }

  const isOwner = project.userId === userDb.id;
  const isCollaborator = project.collaborators.some(
    (c) => c.user.id === userDb.id
  );

  if (!isOwner && !isCollaborator) {
    redirect("/projects/" + id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] text-white pt-30 pb-10">
      {/* Decorative elements matching landing page */}
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-violet-500/5 rounded-full blur-3xl" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <span className="inline-block text-purple-400 font-medium mb-3 bg-purple-500/10 px-3 py-1 rounded-full text-sm">
            Edit
          </span>
          <h1 className="text-3xl font-bold text-white mb-4">Edit Project</h1>
          <p className="text-gray-300 max-w-2xl">
            Update your project information and collaborators
          </p>
        </div>

        <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6">
          <EditProjectForm project={project} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}
