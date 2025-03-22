"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/actions";

type ProjectResponse = {
  error: boolean;
  message?: string;
  project?: {
    id: string;
    name: string;
    description: string;
    thumbnail_url: string;
    github_url: string;
    userId: string;
  };
};

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-400 mb-8">
          Create New Project
        </h1>

        <form
          className="space-y-6  bg-gray-800 p-6 rounded-lg shadow-lg"
          action={async (formData: FormData) => {
            setIsLoading(true);
            setError(null);
            try {
              const result = (await createProject(formData)) as ProjectResponse;
              if (result.error) {
                setError(result.message || "An unknown error occurred");
              } else if (result.project?.id) {
                router.push(`/projects/${result.project.id}`);
              } else {
                setError("Project created but ID not returned");
              }
            } catch (error) {
              setError("Failed to create project. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Enter project name"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              required
              placeholder="Describe your project"
              className="w-full min-h-[100px] rounded-md bg-gray-700 border-gray-600 p-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              type="url"
              required
              placeholder="https://example.com/image.jpg"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              name="github_url"
              type="url"
              required
              placeholder="https://github.com/username/project"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <SubmitButton disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
