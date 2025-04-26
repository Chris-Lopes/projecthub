import { redirect } from "next/navigation";
import { getUser } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
import { CollegeSections } from "@/components/college/college-sections";

export default async function CollegePage() {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const userDb = await Prisma.userDB.findUnique({
    where: { email: user.email },
  });

  if (!userDb || userDb.roleType !== "COLLEGE") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            College Management
          </h1>
          <p className="text-gray-400">
            Manage and monitor institutional performance
          </p>
        </div>

        <CollegeSections />
      </div>
    </div>
  );
}
