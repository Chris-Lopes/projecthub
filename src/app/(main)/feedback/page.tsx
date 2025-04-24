import { getDbUser } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateFeedbackStatus } from "@/app/actions";

interface Feedback {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  student?: {
    user: {
      name: string;
    };
  };
  faculty?: {
    user: {
      name: string;
    };
  };
}

export default async function FeedbacksPage() {
  const userDb = await getDbUser();
  if (!userDb) {
    redirect("/sign-in");
  }

  let feedbacks: Feedback[] = [];

  if (userDb.roleType === "FACULTY") {
    // Get faculty's given feedbacks
    const faculty = await Prisma.faculty.findFirst({
      where: { userId: userDb.id },
      include: {
        feedbacksGiven: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    feedbacks = faculty?.feedbacksGiven || [];
  } else if (userDb.roleType === "STUDENT") {
    // Get student's received feedbacks
    const student = await Prisma.student.findFirst({
      where: { userId: userDb.id },
      include: {
        feedbacksReceived: {
          include: {
            faculty: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    feedbacks = student?.feedbacksReceived || [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-10 from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {userDb.roleType === "FACULTY"
                ? "Given Feedbacks"
                : "Received Feedbacks"}
            </h1>
            <p className="text-gray-400">
              {userDb.roleType === "FACULTY"
                ? "View all feedbacks you've given to students"
                : "View all feedbacks received from faculty"}
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-[#1a1a30]/50 border border-purple-900/50 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {feedback.title}
                  </h3>
                  <p className="text-gray-400">
                    {userDb.roleType === "FACULTY"
                      ? `To: ${feedback.student?.user.name}`
                      : `From: ${feedback.faculty?.user.name}`}
                  </p>
                  {userDb.roleType === "STUDENT" && (
                    <p className="text-white font-bold text-lg">
                      Check your email for the feedback
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className={`${
                      feedback.status === "COMPLETED"
                        ? "bg-green-900/20 text-green-400 border-green-700/50"
                        : "bg-yellow-900/20 text-yellow-400 border-yellow-700/50"
                    }`}
                  >
                    {feedback.status}
                  </Badge>
                  {userDb.roleType === "STUDENT" &&
                    feedback.status === "PENDING" && (
                      <form
                        action={async () => {
                          "use server";
                          await updateFeedbackStatus(feedback.id, "COMPLETED");
                          redirect("/feedback");
                        }}
                      >
                        <Button
                          type="submit"
                          variant="outline"
                          className="bg-green-900/20 text-green-400 border-green-700/50 hover:bg-green-900/30"
                        >
                          Mark as Completed
                        </Button>
                      </form>
                    )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}

          {feedbacks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No feedbacks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
