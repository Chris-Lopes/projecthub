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
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-purple-400 mb-8">
          Edit Project
        </h1>
        <EditProjectForm project={project} isOwner={isOwner} />
      </div>
    </div>
  );
}
