import { getDbUser } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateFeedbackStatus } from "@/app/actions";
import Link from "next/link";

interface Feedback {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  project?: {
    id: string;
    name: string;
  };
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

interface ProjectWithFeedbacks {
  id: string;
  name: string;
  feedbacks: Feedback[];
}

export default async function FeedbacksPage() {
  const userDb = await getDbUser();
  if (!userDb) {
    redirect("/sign-in");
  }

  let feedbacks: Feedback[] = [];
  let projectsWithFeedbacks: ProjectWithFeedbacks[] = [];

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
            project: true,
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
    feedbacks =
      faculty?.feedbacksGiven.map((feedback) => ({
        id: feedback.id,
        title: feedback.title,
        status: feedback.status,
        createdAt: feedback.createdAt,
        project: feedback.project
          ? { id: feedback.project.id, name: feedback.project.name }
          : undefined,
        student: { user: { name: feedback.student.user.name } },
        faculty: { user: { name: feedback.faculty.user.name } },
      })) || [];
  } else if (userDb.roleType === "STUDENT") {
    // Get student's projects and their feedbacks
    const projects = await Prisma.project.findMany({
      where: {
        userId: userDb.id,
      },
      include: {
        feedbacks: {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    projectsWithFeedbacks = projects.map((project) => ({
      id: project.id,
      name: project.name,
      feedbacks: project.feedbacks,
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-10 from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {userDb.roleType === "FACULTY"
                ? "Given Feedbacks"
                : "Project Feedbacks"}
            </h1>
            <p className="text-gray-400">
              {userDb.roleType === "FACULTY"
                ? "View all feedbacks you've given to students"
                : "View all feedbacks received for your projects"}
            </p>
          </div>
        </div>

        {userDb.roleType === "FACULTY" ? (
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
                    <p className="text-gray-400 text-lg font-medium bg-purple-900/20 px-3 mt-1 rounded-md border border-purple-500/30">
                      To: {feedback.student?.user.name}
                      {feedback.project && (
                        <> - Project: {feedback.project.name}</>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
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
                    <Link
                      href={`/projects/${feedback.project?.id}`}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View Project →
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}

            {feedbacks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No feedbacks given yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-8">
            {projectsWithFeedbacks.map((project) => (
              <div key={project.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">
                    {project.name}
                  </h2>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    View Project →
                  </Link>
                </div>
                <div className="grid gap-4">
                  {project.feedbacks.map((feedback) => (
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
                            From: {feedback.faculty?.user.name}
                          </p>
                          <p className="text-white font-bold text-lg mt-2">
                            Check your email for the feedback
                          </p>
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
                          {feedback.status === "PENDING" && (
                            <form
                              action={async () => {
                                "use server";
                                await updateFeedbackStatus(
                                  feedback.id,
                                  "COMPLETED"
                                );
                                redirect("/feedbacks");
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

                  {project.feedbacks.length === 0 && (
                    <div className="text-center py-6 bg-[#1a1a30]/30 rounded-lg">
                      <p className="text-gray-400">
                        No feedbacks received for this project
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {projectsWithFeedbacks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No projects found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
