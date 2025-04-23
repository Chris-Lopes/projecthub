import React from "react";
import { redirect } from "next/navigation";
const page = () => {
  redirect("/projects");
  return <div>viewer page</div>;
};

export default page;
