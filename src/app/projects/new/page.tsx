"use client";

import { createProject } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SDGSelect } from "@/components/sdg-select";
import { SDGGoal } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingReadme, setIsFetchingReadme] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail_url: "",
    github_url: "",
  });
  const [selectedSDGs, setSelectedSDGs] = useState<SDGGoal[]>([]);

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

    const form = new FormData(e.target as HTMLFormElement);
    selectedSDGs.forEach((goal) => {
      form.append("sdgGoals", goal);
    });

    try {
      const result = await createProject(form);
      if (result.error) {
        setError(result.message || "Failed to create project");
      } else if (result.project?.id) {
        router.push(`/projects/${result.project.id}`);
      } else {
        setError("Failed to create project: No project ID returned");
      }
    } catch (error) {
      setError("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-purple-400 mb-8">
          Create New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter project name"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
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
              name="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your project"
              className="w-full min-h-[100px] rounded-md bg-gray-700 border-gray-600 p-2 text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              name="github_url"
              type="url"
              required
              value={formData.github_url}
              onChange={(e) =>
                setFormData({ ...formData, github_url: e.target.value })
              }
              placeholder="https://github.com/username/repository"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              type="url"
              required
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SDG Goals
            </label>
            <SDGSelect selected={selectedSDGs} onChange={setSelectedSDGs} />
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSDGs.map((goal) => (
                <Badge
                  key={goal}
                  variant="outline"
                  className="bg-purple-900/50 text-purple-300 text-xs"
                >
                  {goal}
                </Badge>
              ))}
            </div>
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
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
