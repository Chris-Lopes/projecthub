"use client";

import { createProject, imageUpload } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SDGSelect } from "@/components/sdg-select";
import { SDGGoal } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NewProjectForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingReadme, setIsFetchingReadme] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail_url: "",
    github_url: "",
    website_url: "",
  });
  const [selectedSDGs, setSelectedSDGs] = useState<SDGGoal[]>([]);

  const fetchGithubReadme = useCallback(async () => {
    if (!formData.github_url) return;

    try {
      setIsFetchingReadme(true);
      setError(null);

      // Clean and parse the GitHub URL
      let cleanUrl = formData.github_url.trim();
      cleanUrl = cleanUrl.replace(/\.git$/, "").replace(/\/$/, "");

      const url = new URL(cleanUrl);
      const parts = url.pathname.split("/").filter(Boolean);

      if (parts.length < 2) {
        throw new Error("Invalid GitHub URL format");
      }

      const owner = parts[0];
      const repo = parts[1];

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch README");
      }

      const data = await response.json();

      if (data.content) {
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
  }, [formData.github_url]);

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

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileData = new FormData();
      fileData.append("file", file);

      const result = await imageUpload(fileData);
      if (result && "data" in result && result.data) {
        setFormData((prev) => ({
          ...prev,
          thumbnail_url: result.data.publicUrl,
        }));
      } else if (result && "error" in result) {
        console.error("Upload failed:", result.error);
        setError("Failed to upload image");
      }
    },
    []
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-300">
          Project Name
        </Label>
        <Input
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter project name"
          className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-gray-300">
            Description
          </Label>
          <button
            type="button"
            onClick={fetchGithubReadme}
            disabled={isFetchingReadme || !formData.github_url}
            className={`text-sm text-purple-400 hover:text-purple-300 transition-colors ${
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
          className="w-full min-h-[150px] rounded-md bg-[#1a1a30]/50 border-purple-900/50 p-3 text-gray-300 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url" className="text-gray-300">
          Live Website URL
        </Label>
        <Input
          id="website_url"
          name="website_url"
          type="url"
          value={formData.website_url}
          onChange={(e) =>
            setFormData({ ...formData, website_url: e.target.value })
          }
          placeholder="https://your-deployed-project.com"
          className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
        <p className="text-xs text-gray-400">
          Enter the URL where your project is deployed (optional). This will be
          embedded as a live demo on your project page.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_url" className="text-gray-300">
          GitHub URL
        </Label>
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
          className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail" className="text-gray-300">
          Project Thumbnail
        </Label>
        <div className="flex flex-col gap-4">
          {formData.thumbnail_url && (
            <div className="relative w-full h-48 rounded-md overflow-hidden border border-purple-900/50">
              <Image
                src={formData.thumbnail_url}
                alt="Project thumbnail preview"
                fill
                className="object-cover transition-all hover:scale-105 duration-300"
              />
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full">
              <Input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            <span className="text-sm text-gray-400">or</span>
            <div className="w-full">
              <Input
                id="thumbnail_url"
                name="thumbnail_url"
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    thumbnail_url: e.target.value,
                  })
                }
                placeholder="Enter image URL directly"
                className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
          </div>
        </div>
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
              className="bg-purple-900/30 text-purple-300 border-purple-700/50 text-xs"
            >
              {goal}
            </Badge>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-900/20 border border-red-700/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-2">
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="bg-[#141428]/70 hover:bg-[#1a1a30]/70 text-white border-purple-900/50 hover:border-purple-500/30 transition-all duration-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className={`bg-purple-700 hover:bg-purple-600 text-white border-none transition-all duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
