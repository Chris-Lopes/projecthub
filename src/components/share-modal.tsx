"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { shareProjectWithIndustry } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Mail, Send, X, Link as LinkIcon } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export function ShareModal({ isOpen, onClose, project }: ShareModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    formData.append("studentEmail", project.user.email);

    try {
      const result = await shareProjectWithIndustry(formData);
      if (result.error) {
        setError(result.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError("Failed to share project");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a30] border-purple-900/50 p-6 shadow-2xl shadow-purple-900/20 max-w-2xl mt-14 sm:mt-10">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            Share Project
            <span className="text-sm font-normal text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              with Industry
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Project Preview Card */}
          <div className="rounded-lg bg-[#141428]/50 border border-purple-900/50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium">{project.name}</h4>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300"
                onClick={() => window.open(`/projects/${project.id}`, "_blank")}
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="text-gray-400">
                <span className="text-gray-500">By:</span> {project.user.name}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="toEmail"
                className="block text-sm font-medium text-purple-300 mb-2"
              >
                Industry Expert Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="toEmail"
                  name="toEmail"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="bg-[#141428]/50 pl-10 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-purple-300 mb-2"
              >
                Message to Expert
              </label>
              <Textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="Write a brief message about why this project would be interesting..."
                className="bg-[#141428]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-600 resize-none"
              />
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-900/20 border border-green-700/50 p-4">
              <p className="text-green-400 text-sm">
                Project shared successfully!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#141428]/80 border-purple-900/50 text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-700 hover:bg-purple-600 text-white border border-purple-500/20"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Sending..." : "Share Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
