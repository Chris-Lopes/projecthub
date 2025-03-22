"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prismaClient";
import { RoleType } from "@prisma/client";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();
  const name = formData.get("name")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !role || !name) {
    return {
      error: true,
      message: "Email, password, name and role are required",
    };
  }

  // Additional validation for student role
  if (role.toUpperCase() === "STUDENT") {
    const roll_no = formData.get("roll_no")?.toString();
    const class_name = formData.get("class")?.toString();
    const academic_year = formData.get("academic_year")?.toString();

    if (!roll_no || !class_name || !academic_year) {
      return {
        error: true,
        message:
          "Roll number, class and academic year are required for students",
      };
    }

    // Check if roll number already exists
    const existingStudent = await Prisma.student.findUnique({
      where: { roll_no },
    });

    if (existingStudent) {
      return {
        error: true,
        message: "A student with this roll number already exists",
      };
    }
  }

  try {
    // Check if user already exists in UserDB
    const existingUser = await Prisma.userDB.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: true,
        message: "An account with this email already exists",
      };
    }

    // First attempt the signup
    const { error: signUpError, data: authData } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (signUpError) {
      console.error(signUpError.code + " " + signUpError.message);
      return {
        error: true,
        message: signUpError.message,
      };
    }

    // Create the user in UserDB
    const roleType = role.toUpperCase() as RoleType;
    const user = await Prisma.userDB.create({
      data: {
        email,
        name,
        roleType,
      },
    });

    // Create entry in the role-specific table
    switch (roleType) {
      case "VIEWER":
        await Prisma.viewer.create({
          data: {
            userId: user.id,
          },
        });
        break;
      case "STUDENT":
        const roll_no = formData.get("roll_no")?.toString() || "";
        const class_name = formData.get("class")?.toString() || "";
        const academic_year = parseInt(
          formData.get("academic_year")?.toString() || "0"
        );

        await Prisma.student.create({
          data: {
            userId: user.id,
            roll_no,
            class: class_name,
            academic_year,
          },
        });
        break;
      case "FACULTY":
        await Prisma.faculty.create({
          data: {
            userId: user.id,
          },
        });
        break;
      case "COLLEGE":
        await Prisma.college.create({
          data: {
            userId: user.id,
          },
        });
        break;
    }

    return {
      error: false,
      message:
        "Account created successfully! 🎉 Please check your email for a verification link. You must verify your email before signing in.",
    };
  } catch (error) {
    console.error("Database error:", error);
    // If database creation fails, we should delete the auth user if it was created
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    } catch (cleanupError) {
      console.error("Failed to cleanup auth user:", cleanupError);
    }

    return {
      error: true,
      message: "Failed to create user profile. Please try again.",
    };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export async function createProject(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const userDb = await Prisma.userDB.findUnique({
    where: { email: user.email },
  });
  if (!userDb) {
    return {
      error: true,
      message: "User not found",
    };
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const thumbnail_url = formData.get("thumbnail_url")?.toString();
  const github_url = formData.get("github_url")?.toString();

  if (!name || !description || !thumbnail_url || !github_url) {
    return {
      error: true,
      message: "All fields are required",
    };
  }

  try {
    const project = await Prisma.project.create({
      data: {
        name,
        description,
        thumbnail_url,
        github_url,
        userId: userDb.id,
      },
    });

    return {
      error: false,
      project,
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      error: true,
      message: "Failed to create project",
    };
  }
}

export async function incrementProjectViews(projectId: string) {
  try {
    if (!projectId) {
      return {
        error: true,
        message: "Project ID is required",
      };
    }

    // Check if project exists
    const project = await Prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return {
        error: true,
        message: "Project not found",
      };
    }

    // Increment view count
    await Prisma.project.update({
      where: { id: projectId },
      data: { views: { increment: 1 } },
    });

    return {
      error: false,
      message: "View count incremented successfully",
    };
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return {
      error: true,
      message: "Failed to increment view count",
    };
  }
}

export async function toggleProjectLike(projectId: string) {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "You must be logged in to like projects",
    };
  }

  const userDb = await Prisma.userDB.findUnique({
    where: { email: user.email },
  });
  if (!userDb) {
    return {
      error: true,
      message: "User not found",
    };
  }

  try {
    // Check if user has already liked the project
    const existingLike = await Prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId: userDb.id,
          projectId,
        },
      },
    });

    if (existingLike) {
      // Remove like
      await Prisma.projectLike.delete({
        where: {
          userId_projectId: {
            userId: userDb.id,
            projectId,
          },
        },
      });

      // Decrement like count
      await Prisma.project.update({
        where: { id: projectId },
        data: { likes: { decrement: 1 } },
      });

      return {
        error: false,
        liked: false,
        message: "Project unliked successfully",
      };
    }

    // Add new like
    await Prisma.projectLike.create({
      data: {
        userId: userDb.id,
        projectId,
      },
    });

    // Increment like count
    await Prisma.project.update({
      where: { id: projectId },
      data: { likes: { increment: 1 } },
    });

    return {
      error: false,
      liked: true,
      message: "Project liked successfully",
    };
  } catch (error) {
    console.error("Error toggling project like:", error);
    return {
      error: true,
      message: "Failed to toggle project like",
    };
  }
}

export async function getProjectLikeStatus(projectId: string) {
  const user = await getUser();
  if (!user) {
    return false;
  }

  const userDb = await Prisma.userDB.findUnique({
    where: { email: user.email },
  });
  if (!userDb) {
    return false;
  }

  try {
    const like = await Prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId: userDb.id,
          projectId,
        },
      },
    });

    return !!like;
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
}
