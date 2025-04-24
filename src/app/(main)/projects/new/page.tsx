import { getUser } from "@/app/actions";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prismaClient";
import NewProjectForm from "./new-project-form";

export default async function NewProjectPage() {
  // Add server-side protection
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userDb = await Prisma.userDB.findUnique({
    where: { email: user.email },
  });

  if (!userDb || userDb.roleType === "VIEWER") {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-30 pb-10">
      {/* Decorative elements matching landing page */}
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-violet-500/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <span className="inline-block text-purple-400 font-medium mb-3 bg-purple-500/10 px-3 py-1 rounded-full text-sm">
            Create
          </span>
          <h1 className="text-3xl font-bold text-white mb-4">New Project</h1>
          <p className="text-gray-300 max-w-2xl">
            Share your innovative project with the community
          </p>
        </div>

        <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6">
          <NewProjectForm />
        </div>
      </div>
    </div>
  );
}
