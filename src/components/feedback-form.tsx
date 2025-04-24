"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { submitFeedback } from "@/app/actions";
import { redirect } from "next/navigation";

interface FeedbackFormProps {
  studentId: string;
  studentEmail: string;
  projectId: string;
}

export function FeedbackForm({
  studentId,
  studentEmail,
  projectId,
}: FeedbackFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.append("studentId", studentId);
    formData.append("studentEmail", studentEmail);
    formData.append("projectId", projectId);

    try {
      const result = await submitFeedback(formData);
      if (result.error) {
        setError(result.message);
      } else {
        setSuccess(true);
        // Reset form
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setError("Failed to submit feedback");
    } finally {
      setIsLoading(false);
      redirect("/feedbacks");
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Feedback Title
          </label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Enter feedback title"
            className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200"
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Feedback Message
          </label>
          <Textarea
            id="body"
            name="body"
            required
            rows={6}
            placeholder="Enter your feedback message"
            className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm p-3 rounded-md bg-red-900/20 border border-red-700/50">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-400 text-sm p-3 rounded-md bg-green-900/20 border border-green-700/50">
            Feedback sent successfully!
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-purple-700 hover:bg-purple-600 text-white ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Sending..." : "Send Feedback"}
        </Button>
      </form>
    </div>
  );
}
