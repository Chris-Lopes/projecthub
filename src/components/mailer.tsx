"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { sendEmail } from "@/app/actions";

export function Mailer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await sendEmail(formData);
      if (result.error) {
        setError(result.message);
      } else {
        setSuccess(true);
        // Reset form
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setError("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
            Subject
          </label>
          <Input
            id="subject"
            name="subject"
            required
            placeholder="Enter email subject"
            className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-2">
            Message
          </label>
          <Textarea
            id="body"
            name="body"
            required
            rows={6}
            placeholder="Enter your message"
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
            Email sent successfully!
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-purple-700 hover:bg-purple-600 text-white ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Sending..." : "Send Email"}
        </Button>
      </form>
    </div>
  );
}