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

  // Get student details
  const student = await Prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!student) {
    console.log("Student not found");
    redirect("/"); // Redirect if student not found
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Submit Feedback for {student.user.name}
          </h1>
          <p className="text-gray-400">
            Provide constructive feedback to help the student improve.
          </p>
        </div>

        <FeedbackForm
          studentId={student.id}
          studentEmail={student.user.email}
        />
      </div>
    </div>
  );
}
