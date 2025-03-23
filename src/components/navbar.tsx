"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { checkIsAdmin } from "@/app/actions";
import { useEffect, useState } from "react";
import { NotificationDropdown } from "./notification-dropdown";

export function Navbar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin using server action
    checkIsAdmin().then(setIsAdmin).catch(console.error);
  }, []);

  return (
    <nav className="w-full bg-gray-900 border-b border-purple-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-purple-500 text-xl font-bold">
                Project
                <span className="text-white bg-purple-500 px-1.5 py-1 rounded-sm ml-1">
                  Hub
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/projects"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === "/projects"
                    ? "text-purple-400 border-b-2 border-purple-500"
                    : "text-gray-300 hover:text-purple-400"
                }`}
              >
                Projects
              </Link>
              <Link
                href="/profile"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === "/profile"
                    ? "text-purple-400 border-b-2 border-purple-500"
                    : "text-gray-300 hover:text-purple-400"
                }`}
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === "/admin"
                      ? "text-purple-400 border-b-2 border-purple-500"
                      : "text-gray-300 hover:text-purple-400"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/projects/new">
              <Button
                variant="ghost"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/50"
              >
                <PlusCircle className="h-5 w-5 mr-1" />
                New Project
              </Button>
            </Link>
            <NotificationDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
