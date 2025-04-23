"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prismaClient";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import {
  RoleType,
  NotificationType,
  SDGGoal,
  ProjectStatus,
} from "@prisma/client";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY as string,
});

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();
  const name = formData.get("name")?.toString();
  const supabase = await createClient();

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

  // Additional validation for faculty role
  if (role.toUpperCase() === "FACULTY") {
    const employee_no = formData.get("employee_no")?.toString();
    const designation = formData.get("designation")?.toString();
    const department = formData.get("department")?.toString();

    if (!employee_no || !designation || !department) {
      return {
        error: true,
        message:
          "Employee number, designation and department are required for faculty",
      };
    }

    // Check if employee number already exists
    const existingFaculty = await Prisma.faculty.findUnique({
      where: { employee_no },
    });

    if (existingFaculty) {
      return {
        error: true,
        message: "A faculty member with this employee number already exists",
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
    const roleType = role.toUpperCase() as RoleType;
    const { error: signUpError, data: authData } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          name,
          role: roleType,
        },
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
        const academic_year = formData.get("academic_year")?.toString() || "";

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
        const employee_no = formData.get("employee_no")?.toString() || "";
        const designation = formData.get("designation")?.toString() || "";
        const department = formData.get("department")?.toString() || "";

        await Prisma.faculty.create({
          data: {
            userId: user.id,
            employee_no,
            designation,
            department,
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
  const website_url = formData.get("website_url")?.toString();
  const sdgGoals = formData
    .getAll("sdgGoals")
    .map((goal) => goal.toString() as SDGGoal);

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
        website_url,
        userId: userDb.id,
        sdgGoals,
      } as any,
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

export async function createComment(formData: FormData) {
  try {
    const user = await getUser();
    if (!user) {
      return {
        error: true,
        message: "You must be logged in to comment",
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

    const content = formData.get("content")?.toString();
    const projectId = formData.get("projectId")?.toString();

    if (!content || !projectId) {
      return {
        error: true,
        message: "Content and project ID are required",
      };
    }

    // Get the project and its owner
    const project = await Prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: true,
        collaborators: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return {
        error: true,
        message: "Project not found",
      };
    }

    // Create the comment
    const comment = await Prisma.comment.create({
      data: {
        content,
        userId: userDb.id,
        projectId,
      },
    });

    // Create notification for project owner if the commenter is not the owner
    if (project.userId !== userDb.id) {
      await Prisma.notification.create({
        data: {
          type: NotificationType.NEW_COMMENT,
          message: `${userDb.name} commented on your project "${project.name}"`,
          userId: project.userId,
          projectId: project.id,
        },
      });
    }

    // Create notifications for collaborators (except the commenter)
    const collaboratorNotifications = project.collaborators
      .filter((collab) => collab.userId !== userDb.id)
      .map((collab) => ({
        type: NotificationType.NEW_COMMENT,
        message: `${userDb.name} commented on "${project.name}"`,
        userId: collab.userId,
        projectId: project.id,
      }));

    if (collaboratorNotifications.length > 0) {
      await Prisma.notification.createMany({
        data: collaboratorNotifications,
      });
    }

    return {
      error: false,
      comment,
    };
  } catch (error) {
    return {
      error: true,
      message: "Failed to create comment",
    };
  }
}

export async function deleteComment(commentId: string) {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "You must be logged in to delete comments",
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
    // Check if comment exists and belongs to user
    const comment = await Prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return {
        error: true,
        message: "Comment not found",
      };
    }

    if (comment.userId !== userDb.id) {
      return {
        error: true,
        message: "You can only delete your own comments",
      };
    }

    // Delete the comment
    await Prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      error: false,
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      error: true,
      message: "Failed to delete comment",
    };
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "You must be logged in to update projects",
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

  // Check if project exists
  const project = await Prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: true,
    },
  });

  if (!project) {
    return {
      error: true,
      message: "Project not found",
    };
  }

  // Check if user is owner or collaborator
  const isOwner = project.userId === userDb.id;
  const isCollaborator = project.collaborators.some(
    (c) => c.userId === userDb.id
  );

  if (!isOwner && !isCollaborator) {
    return {
      error: true,
      message: "You don't have permission to edit this project",
    };
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const thumbnail_url = formData.get("thumbnail_url")?.toString();
  const github_url = formData.get("github_url")?.toString();
  const website_url = formData.get("website_url")?.toString();
  const sdgGoals = formData
    .getAll("sdgGoals")
    .map((goal) => goal.toString() as SDGGoal);

  if (!name || !description || !thumbnail_url || !github_url) {
    return {
      error: true,
      message: "All fields are required",
    };
  }

  try {
    const updatedProject = await Prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        thumbnail_url,
        github_url,
        website_url,
        sdgGoals,
      } as any,
    });

    return {
      error: false,
      project: updatedProject,
    };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      error: true,
      message: "Failed to update project",
    };
  }
}

export async function addCollaborator(projectId: string, email: string) {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "You must be logged in to add collaborators",
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

  // Check if the project exists and the user is the owner
  const project = await Prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return {
      error: true,
      message: "Project not found",
    };
  }

  if (project.userId !== userDb.id) {
    return {
      error: true,
      message: "Only the project owner can add collaborators",
    };
  }

  // Find the user to be added as collaborator
  const collaborator = await Prisma.userDB.findUnique({
    where: { email },
  });

  if (!collaborator) {
    return {
      error: true,
      message: "Collaborator email not found",
    };
  }

  // Check if user is already a collaborator
  const existingCollaborator = await Prisma.projectCollaborator.findUnique({
    where: {
      userId_projectId: {
        userId: collaborator.id,
        projectId,
      },
    },
  });

  if (existingCollaborator) {
    return {
      error: true,
      message: "User is already a collaborator",
    };
  }

  try {
    await Prisma.projectCollaborator.create({
      data: {
        userId: collaborator.id,
        projectId,
      },
    });

    return {
      error: false,
      message: "Collaborator added successfully",
    };
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return {
      error: true,
      message: "Failed to add collaborator",
    };
  }
}

export async function removeCollaborator(
  projectId: string,
  collaboratorId: string
) {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "You must be logged in to remove collaborators",
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

  // Check if the project exists and the user is the owner
  const project = await Prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return {
      error: true,
      message: "Project not found",
    };
  }

  if (project.userId !== userDb.id) {
    return {
      error: true,
      message: "Only the project owner can remove collaborators",
    };
  }

  try {
    await Prisma.projectCollaborator.delete({
      where: {
        userId_projectId: {
          userId: collaboratorId,
          projectId,
        },
      },
    });

    return {
      error: false,
      message: "Collaborator removed successfully",
    };
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return {
      error: true,
      message: "Failed to remove collaborator",
    };
  }
}

export async function getProjectCollaborators(projectId: string) {
  try {
    const collaborators = await Prisma.projectCollaborator.findMany({
      where: { projectId },
      include: {
        user: {
          include: {
            student: true,
          },
        },
      },
    });

    return {
      error: false,
      collaborators,
    };
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return {
      error: true,
      message: "Failed to fetch collaborators",
    };
  }
}

export async function approveProject(projectId: string) {
  const user = await getUser();
  if (!user?.email || user.email !== process.env.ADMIN_USER_EMAIL) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  try {
    const project = await Prisma.project.update({
      where: { id: projectId },
      data: { status: "APPROVED" },
      include: {
        user: true,
      },
    });

    // Create notification for project owner
    await Prisma.notification.create({
      data: {
        type: NotificationType.PROJECT_APPROVED,
        message: `Your project "${project.name}" has been approved!`,
        userId: project.userId,
        projectId: project.id,
      },
    });

    return {
      error: false,
      project,
    };
  } catch (error) {
    console.error("Error approving project:", error);
    return {
      error: true,
      message: "Failed to approve project",
    };
  }
}

export async function rejectProject(projectId: string) {
  const user = await getUser();
  if (!user?.email || user.email !== process.env.ADMIN_USER_EMAIL) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  try {
    const project = await Prisma.project.update({
      where: { id: projectId },
      data: { status: "REJECTED" },
      include: {
        user: true,
      },
    });

    // Create notification for project owner
    await Prisma.notification.create({
      data: {
        type: NotificationType.PROJECT_REJECTED,
        message: `Your project "${project.name}" has been rejected.`,
        userId: project.userId,
        projectId: project.id,
      },
    });

    return {
      error: false,
      project,
    };
  } catch (error) {
    console.error("Error rejecting project:", error);
    return {
      error: true,
      message: "Failed to reject project",
    };
  }
}

export async function getNotifications() {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "Not authenticated", notifications: [] };
    }

    const userDb = await Prisma.userDB.findUnique({
      where: { email: user.email },
    });
    if (!userDb) {
      return { error: "User not found", notifications: [] };
    }

    const notifications = await Prisma.notification.findMany({
      where: {
        userId: userDb.id,
        read: false, // Only fetch unread notifications
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return { notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { error: "Failed to fetch notifications", notifications: [] };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const userDb = await Prisma.userDB.findUnique({
      where: { email: user.email },
    });
    if (!userDb) {
      return { error: "User not found" };
    }

    // Verify the notification belongs to the user
    const notification = await Prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userDb.id,
      },
    });

    if (!notification) {
      return { error: "Notification not found" };
    }

    await Prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Failed to mark notification as read" };
  }
}

export async function checkIsAdmin() {
  const user = await getUser();
  return user?.email === process.env.ADMIN_USER_EMAIL;
}

export async function getProject(id: string) {
  try {
    const project = await Prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            roleType: true,
            student: {
              select: {
                roll_no: true,
                class: true,
                academic_year: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              include: {
                student: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!project) {
      return { error: true, message: "Project not found" };
    }

    return { error: false, project };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { error: true, message: "Failed to fetch project" };
  }
}

export async function getProjectsAction(page = 1, limit = 9) {
  const user = await getUser();
  const userDb = user
    ? await Prisma.userDB.findUnique({
        where: { email: user.email },
      })
    : null;

  const skip = (page - 1) * limit;

  const whereCondition = {
    OR: [
      { status: ProjectStatus.APPROVED },
      user?.email === process.env.ADMIN_USER_EMAIL
        ? { status: { not: undefined } }
        : userDb
        ? {
            AND: [
              { userId: userDb.id },
              {
                OR: [
                  { userId: userDb.id },
                  { collaborators: { some: { userId: userDb.id } } },
                ],
              },
            ],
          }
        : { status: ProjectStatus.APPROVED },
    ],
  };

  const [projects, totalCount] = await Promise.all([
    Prisma.project.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            roleType: true,
            student: {
              select: {
                roll_no: true,
                class: true,
                academic_year: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [{ likes: "desc" }, { views: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip,
    }),
    Prisma.project.count({
      where: whereCondition,
    }),
  ]);

  return {
    projects,
    currentUserId: userDb?.id,
    pagination: {
      total: totalCount,
      pageCount: Math.ceil(totalCount / limit),
      currentPage: page,
    },
  };
}

export async function getLeaderboardProjects() {
  try {
    const projects = await Prisma.project.findMany({
      where: {
        status: ProjectStatus.APPROVED,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            student: {
              select: {
                roll_no: true,
                class: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        { likes: "desc" },
        { views: "desc" },
        { comments: { _count: "desc" } },
      ],
      take: 10, // Top 10 projects
    });

    // Transform the projects to include comment count
    const projectsWithCommentCount = projects.map(project => ({
      ...project,
      commentCount: project.comments.length,
    }));

    return { 
      error: false, 
      projects: projectsWithCommentCount 
    };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { error: true, message: "Failed to fetch leaderboard" };
  }
}

export async function imageUpload(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file) return { error: "No file uploaded" };

  const buffer = await file.arrayBuffer();

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("projecthub-test-bucket") // Bucket name
    .upload(`projects/thumbnails/${file.name}`, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("Supabase Error:", error);
    return { error: error.message };
  }

  if (data) {
    const { data: urlData } = supabase.storage
      .from("projecthub-test-bucket")
      .getPublicUrl(`projects/thumbnails/${file.name}`);
    return { data: urlData };
  }

  return { error: "Failed to get public URL" };
}

async function extractJSONFromText(text: string) {
  try {
    try {
      return JSON.parse(text);
    } catch {
      // Try to find a JSON object in the text using regex
      const jsonMatch = text.match(/\{[^]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }
      // Clean and parse the JSON
      const cleanJson = jsonMatch[0].trim();
      return JSON.parse(cleanJson);
    }
  } catch (error) {
    console.error("JSON extraction error:", error);
    throw new Error("Failed to parse data");
  }
}

export async function StudentIdCardExtraction(formData: FormData) {
  try {
    const file = formData.get("id_card") as File;
    if (!file) {
      throw new Error("No image file provided");
    }

    // Upload the image file
    const image = await genAI.files.upload({
      file: file,
    });

    const prompt = `
      Analyze this ID Card image and extract ONLY the following information:
      1. Name
      2. Roll No
      3. Branch
      4. Also get the current academic year of the student (eg : on the id card it is written STUDENT IDENTITY CARD 2023 - 2027 , so get the last year "2027" return this last date as numeric_last_year)

      Return ONLY a JSON object with this exact format:
      {
        "name": "store name here",
        "roll_no": "numeric_roll_no_here",
        "branch": "store branch here",
        "year": numeric_last_year
      }
    `;

    // Generate content with structured prompt and image
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          prompt,
          createPartFromUri(image.uri as string, image.mimeType as string),
        ]),
      ],
    });

    // Get the response text
    const responseText = await result.text;
    console.log(responseText);

    // Parse the JSON from the response
    const extractedData = await extractJSONFromText(responseText as string);

    if (!extractedData || typeof extractedData !== "object") {
      throw new Error("Invalid response format");
    }

    // Validate the extracted data structure
    const requiredFields = ["name", "roll_no", "branch", "year"];
    for (const field of requiredFields) {
      if (!(field in extractedData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return extractedData;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

export async function FacultyIdCardExtraction(formData: FormData) {
  try {
    const file = formData.get("id_card") as File;
    if (!file) {
      throw new Error("No image file provided");
    }

    // Upload the image file
    const image = await genAI.files.upload({
      file: file,
    });

    const prompt = `
      Analyze this ID Card image and extract ONLY the following information:
      1. Name
      2. Employee No
      3. Designation
      4. Department

      Return ONLY a JSON object with this exact format:
      {
        "name": "store name here",
        "employee_no": numeric_employee_no_here,
        "designation": "store designation here",
        "department": "store department here"
      }
    `;

    // Generate content with structured prompt and image
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          prompt,
          createPartFromUri(image.uri as string, image.mimeType as string),
        ]),
      ],
    });

    // Get the response text
    const responseText = await result.text;
    console.log(responseText);

    // Parse the JSON from the response
    const extractedData = await extractJSONFromText(responseText as string);

    if (!extractedData || typeof extractedData !== "object") {
      throw new Error("Invalid response format");
    }

    // Validate the extracted data structure
    const requiredFields = ["name", "employee_no", "designation", "department"];
    for (const field of requiredFields) {
      if (!(field in extractedData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return extractedData;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}
