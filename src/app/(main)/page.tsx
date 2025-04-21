import { redirect } from "next/navigation";
import { getUser } from "@/app/actions";
import { Prisma } from "@/lib/prismaClient";
export default async function Home() {
  const User = await getUser();
  if (!User) {
    return redirect("/sign-in");
  }

  const UserDB = await Prisma.userDB.findUnique({
    where: {
      email: User.email,
    },
  });

  if (UserDB?.roleType === "STUDENT") {
    return redirect("/student");
  }

  if (UserDB?.roleType === "VIEWER") {
    return redirect("/viewer");
  }

  if (UserDB?.roleType === "FACULTY") {
    return redirect("/faculty");
  }

  if (UserDB?.roleType === "COLLEGE") {
    return redirect("/college");
  }

  return <div>How are you here? no one is allowed here!</div>;
}
