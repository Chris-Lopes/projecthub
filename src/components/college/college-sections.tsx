"use client";

import Link from "next/link";
import { BarChart3, FileText, Users2 } from "lucide-react";

const sections = [
  {
    title: "Analytics Dashboard",
    description: "View institutional performance metrics and project statistics",
    icon: BarChart3,
    href: "/college/analytics",
  },
  {
    title: "Reports",
    description: "Generate detailed reports on project performance and impact",
    icon: FileText,
    href: "/college/reports",
  },
  {
    title: "Industry Engagement",
    description: "Track and manage industry collaborations and partnerships",
    icon: Users2,
    href: "/college/industry",
  },
];

export function CollegeSections() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sections.map((section) => (
        <Link
          key={section.title}
          href={section.href}
          className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 p-6 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-900/20"
        >
          <section.icon className="w-8 h-8 text-purple-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            {section.title}
          </h2>
          <p className="text-gray-400 text-sm">{section.description}</p>
        </Link>
      ))}
    </div>
  );
}