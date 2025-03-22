"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProject } from "@/app/actions";
import { Project } from "@prisma/client";

interface EditProjectFormProps {
  project: Project;
}

interface EditProjectFormData {
  name: string;
  description: string;
  thumbnail_url: string;
  github_url: string;
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<EditProjectFormData>({
    name: project.name,
    description: project.description,
    thumbnail_url: project.thumbnail_url,
    github_url: project.github_url,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingReadme, setIsFetchingReadme] = useState(false);

  const fetchGithubReadme = async () => {
    try {
      setIsFetchingReadme(true);
      setError(null);

      // Extract owner and repo from github_url
      const url = new URL(formData.github_url);
      const [, owner, repo] = url.pathname.split("/");

      if (!owner || !repo) {
        throw new Error("Invalid GitHub URL format");
      }

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

    try {
      const result = await updateProject(project.id, form);
      if (result.error) {
        setError(result.message || "Failed to update project");
      } else {
        router.push(`/projects/${project.id}`);
      }
    } catch (error) {
      setError("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300"
        >
          Project Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
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
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="github_url"
          className="block text-sm font-medium text-gray-300"
        >
          GitHub URL
        </label>
        <input
          type="url"
          id="github_url"
          value={formData.github_url}
          onChange={(e) =>
            setFormData({ ...formData, github_url: e.target.value })
          }
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
        <input
          type="url"
          id="thumbnail_url"
          value={formData.thumbnail_url}
          onChange={(e) =>
            setFormData({ ...formData, thumbnail_url: e.target.value })
          }
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
        />
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
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
