import React from "react";
import { redirect } from "next/navigation";
const page = () => {
  redirect("/projects");
  return <div>student page</div>;
};

export default page;
