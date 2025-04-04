"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { PlusCircle, Menu } from "lucide-react";
import { checkIsAdmin } from "@/app/actions";
import { useEffect, useState } from "react";
import { NotificationDropdown } from "./notification-dropdown";
import { Logo } from "@/components/logo";

export function Navbar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkIsAdmin().then(setIsAdmin).catch(console.error);
  }, []);

  return (
    <div className="fixed w-full px-4 sm:px-6 top-4 z-70">
      <header className="mx-auto max-w-5xl bg-[#141428]/30 backdrop-blur-md rounded-full border border-purple-900/30 shadow-lg shadow-black/20">
        <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Logo
                size="md"
                className="group-hover:opacity-90 transition-opacity"
              />
            </Link>
            <div className="hidden sm:flex sm:ml-8 space-x-6">
              <Link
                href="/projects"
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  pathname === "/projects"
                    ? "text-white bg-purple-600/30 border border-purple-500/30"
                    : "text-gray-300 hover:text-purple-400 hover:bg-purple-900/20"
                }`}
              >
                Projects
              </Link>
              <Link
                href="/profile"
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  pathname === "/profile"
                    ? "text-white bg-purple-600/30 border border-purple-500/30"
                    : "text-gray-300 hover:text-purple-400 hover:bg-purple-900/20"
                }`}
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                    pathname === "/admin"
                      ? "text-white bg-purple-600/30 border border-purple-500/30"
                      : "text-gray-300 hover:text-purple-400 hover:bg-purple-900/20"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/projects/new" className="hidden sm:block">
              <Button
                variant="ghost"
                className="bg-purple-600/20 hover:bg-purple-600/40 text-white hover:text-white rounded-full px-4 py-2 transition-all duration-300 hover:shadow-sm hover:shadow-purple-900/30 border border-purple-500/20 hover:border-purple-500/30"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
            <div className="hidden sm:block">
              <NotificationDropdown />
            </div>

            {/* Mobile menu button */}
            <button className="sm:hidden text-white hover:text-purple-400 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
