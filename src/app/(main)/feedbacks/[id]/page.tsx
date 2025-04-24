import { getDbUser } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { FeedbackForm } from "@/components/feedback-form";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackPage({ params }: PageProps) {
  const { id } = await params;
  const userDb = await getDbUser();
  if (!userDb) {
    redirect("/sign-in");
  }

  // Check if user is faculty
  if (userDb.roleType !== "FACULTY") {
    console.log("User is not faculty");
    redirect("/"); // Redirect non-faculty users
  }

  // Get faculty details
  const faculty = await Prisma.faculty.findFirst({
    where: {
      userId: userDb.id,
    },
  });

  if (!faculty) {
    console.log("Faculty details not found");
    redirect("/"); // Redirect if faculty details not found
  }

  // Get project details
  const project = await Prisma.project.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!project || !project.user.student) {
    console.log("Project not found or owner is not a student");
    redirect("/"); // Redirect if project not found or owner is not a student
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Submit Feedback for {project.name}
          </h1>
          <p className="text-gray-400 font-medium bg-purple-900/20 inline-block px-3 py-1 rounded-md border border-purple-500/30">
            Project by {project.user.name} ({project.user.student.roll_no})
          </p>
          <p className="text-gray-400">
            Provide constructive feedback to help the student improve.
          </p>
        </div>

        <FeedbackForm
          projectId={project.id}
          studentId={project.user.student.id}
          studentEmail={project.user.email}
        />
      </div>
    </div>
  );
}
