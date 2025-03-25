"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateProject,
  addCollaborator,
  removeCollaborator,
  getProjectCollaborators,
} from "@/app/actions";
import { Project, SDGGoal } from "@prisma/client";
import { UserCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SDGSelect } from "@/components/sdg-select";

interface EditProjectFormProps {
  project: Project;
  isOwner: boolean;
}

interface EditProjectFormData {
  name: string;
  description: string;
  thumbnail_url: string;
  github_url: string;
  sdgGoals: SDGGoal[];
}

interface Collaborator {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    student: {
      roll_no: string;
      class: string;
      academic_year: number;
    } | null;
  };
}

export default function EditProjectForm({
  project,
  isOwner,
}: EditProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<EditProjectFormData>({
    name: project.name,
    description: project.description,
    thumbnail_url: project.thumbnail_url,
    github_url: project.github_url,
    sdgGoals: project.sdgGoals || [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingReadme, setIsFetchingReadme] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [collaboratorError, setCollaboratorError] = useState<string | null>(
    null
  );
  const [selectedSDGs, setSelectedSDGs] = useState<SDGGoal[]>(
    project.sdgGoals || []
  );

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    const result = await getProjectCollaborators(project.id);
    if (!result.error && result.collaborators) {
      setCollaborators(
        result.collaborators.map((collab) => ({
          ...collab,
          user: {
            ...collab.user,
            student: collab.user.student
              ? {
                  ...collab.user.student,
                  academic_year: parseInt(collab.user.student.academic_year),
                }
              : null,
          },
        }))
      );
    }
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingCollaborator(true);
    setCollaboratorError(null);

    try {
      const result = await addCollaborator(project.id, newCollaboratorEmail);
      if (result.error) {
        setCollaboratorError(result.message);
      } else {
        setNewCollaboratorEmail("");
        await loadCollaborators();
      }
    } catch (error) {
      setCollaboratorError("Failed to add collaborator");
    } finally {
      setIsAddingCollaborator(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const result = await removeCollaborator(project.id, collaboratorId);
      if (!result.error) {
        await loadCollaborators();
      }
    } catch (error) {
      setCollaboratorError("Failed to remove collaborator");
    }
  };

  const fetchGithubReadme = async () => {
    try {
      setIsFetchingReadme(true);
      setError(null);

      // Clean and parse the GitHub URL
      let cleanUrl = formData.github_url.trim();
      // Remove .git extension if present
      cleanUrl = cleanUrl.replace(/\.git$/, "");
      // Remove trailing slash if present
      cleanUrl = cleanUrl.replace(/\/$/, "");

      const url = new URL(cleanUrl);
      const parts = url.pathname.split("/").filter(Boolean);

      if (parts.length < 2) {
        throw new Error("Invalid GitHub URL format");
      }

      const owner = parts[0];
      const repo = parts[1];

      // Fetch README content
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch README");
      }

      const data = await response.json();

      if (data.content) {
        // Decode base64 content
        const content = atob(data.content.replace(/\n/g, ""));
        setFormData((prev) => ({ ...prev, description: content }));
      }
    } catch (error) {
      setError(
        "Failed to fetch README. Please make sure the GitHub URL is correct and the repository is public."
      );
      console.error("GitHub README fetch error:", error);
    } finally {
      setIsFetchingReadme(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("thumbnail_url", formData.thumbnail_url);
    form.append("github_url", formData.github_url);
    selectedSDGs.forEach((goal) => {
      form.append("sdgGoals", goal);
    });

    try {
      const result = await updateProject(project.id, form);
      if (result.error) {
        setError(result.message || "Failed to update project");
      } else if (result.project?.id) {
        router.push(`/projects/${project.id}`);
      } else {
        setError("Failed to update project: No project ID returned");
      }
    } catch (error) {
      setError("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Project Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 bg-gray-800 text-gray-300 border-gray-700"
            required
            placeholder="Enter project name"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <button
              type="button"
              onClick={fetchGithubReadme}
              disabled={isFetchingReadme || !formData.github_url}
              className={`text-sm text-purple-400 hover:text-purple-300 ${
                isFetchingReadme || !formData.github_url
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isFetchingReadme ? "Fetching README..." : "Use GitHub README"}
            </button>
          </div>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="mt-1 bg-gray-800 text-gray-300 border-gray-700"
            required
            placeholder="Describe your project"
          />
        </div>

        <div>
          <label
            htmlFor="github_url"
            className="block text-sm font-medium text-gray-300"
          >
            GitHub URL
          </label>
          <Input
            type="url"
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={(e) =>
              setFormData({ ...formData, github_url: e.target.value })
            }
            className="mt-1 bg-gray-800 text-gray-300 border-gray-700"
            required
            placeholder="https://github.com/username/repository"
          />
        </div>

        <div>
          <label
            htmlFor="thumbnail_url"
            className="block text-sm font-medium text-gray-300"
          >
            Thumbnail URL
          </label>
          <Input
            type="url"
            id="thumbnail_url"
            name="thumbnail_url"
            value={formData.thumbnail_url}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail_url: e.target.value })
            }
            className="mt-1 bg-gray-800 text-gray-300 border-gray-700"
            required
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            SDG Goals
          </label>
          <SDGSelect selected={selectedSDGs} onChange={setSelectedSDGs} />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
          >
            Cancel
          </button>
          <Button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {isOwner && (
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-purple-400">
            Project Collaborators
          </h3>

          <form onSubmit={handleAddCollaborator} className="space-y-4">
            <div>
              <label
                htmlFor="collaborator_email"
                className="block text-sm font-medium text-gray-300"
              >
                Add Collaborator by Email
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="email"
                  id="collaborator_email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  placeholder="teammate@example.com"
                  className="flex-1 p-2 rounded-md bg-gray-700 border-gray-600 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isAddingCollaborator || !newCollaboratorEmail}
                  className={`px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${
                    isAddingCollaborator || !newCollaboratorEmail
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isAddingCollaborator ? "Adding..." : "Add"}
                </button>
              </div>
            </div>

            {collaboratorError && (
              <p className="text-red-400 text-sm">{collaboratorError}</p>
            )}
          </form>

          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between bg-gray-700 p-3 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <UserCircle className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-gray-200">{collaborator.user.name}</p>
                    <p className="text-sm text-gray-400">
                      {collaborator.user.email}
                    </p>
                    {collaborator.user.student && (
                      <p className="text-xs text-gray-500">
                        {collaborator.user.student.roll_no} •{" "}
                        {collaborator.user.student.class}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCollaborator(collaborator.user.id)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  title="Remove collaborator"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}

            {collaborators.length === 0 && (
              <p className="text-gray-400 text-sm">No collaborators yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
