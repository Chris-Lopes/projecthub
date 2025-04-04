"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";

export function ProjectShowcase() {
  return (
    <div className="overflow-hidden">
      <div className="pt-10 md:pt-16">
        <ContainerScroll
          className="bg-[#141428]/50"
          titleComponent={
            <>
              <span className="inline-block text-purple-400 font-medium mb-3 bg-purple-500/10 px-3 py-1 rounded-full text-sm">
                Featured Projects
              </span>
              <h2
                className="text-3xl md:text-5xl font-bold text-white mb-12
              "
              >
                See What Students Are Building
              </h2>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full p-2 md:p-6">
            {/* Project Card 1 */}
            <div className="bg-[#141428]/80 rounded-xl p-4 flex flex-col hover:bg-[#1A1A2E]/80 transition-colors border border-purple-900/50 h-full">
              <div className="relative h-32 md:h-40 mb-4">
                <Image
                  src="/images/project-1.jpg"
                  alt="Clean Water Project"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="bg-purple-500/10 px-3 py-1 rounded-full w-fit mb-3">
                <span className="text-sm font-medium text-purple-400">
                  SDG #6
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Smart Water Monitoring System
              </h3>
              <p className="text-gray-300 text-sm flex-grow">
                IoT solution for real-time water quality monitoring in urban
                communities.
              </p>
              <Link
                href="/projects/water-monitoring"
                className="mt-4 text-purple-400 text-sm flex items-center"
              >
                View Project
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Project Card 2 */}
            <div className="bg-[#141428]/80 rounded-xl p-4 flex flex-col hover:bg-[#1A1A2E]/80 transition-colors border border-purple-900/50 h-full">
              <div className="relative h-32 md:h-40 mb-4">
                <Image
                  src="/images/project-2.jpg"
                  alt="Renewable Energy"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="bg-purple-500/10 px-3 py-1 rounded-full w-fit mb-3">
                <span className="text-sm font-medium text-purple-400">
                  SDG #7
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Solar-Powered Learning Stations
              </h3>
              <p className="text-gray-300 text-sm flex-grow">
                Bringing renewable energy and education technology to remote
                areas.
              </p>
              <Link
                href="/projects/solar-learning"
                className="mt-4 text-purple-400 text-sm flex items-center"
              >
                View Project
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Project Card 3 */}
            <div className="bg-[#141428]/80 rounded-xl p-4 flex flex-col hover:bg-[#1A1A2E]/80 transition-colors border border-purple-900/50 h-full">
              <div className="relative h-32 md:h-40 mb-4">
                <Image
                  src="/images/project-3.jpg"
                  alt="Urban Agriculture"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="bg-purple-500/10 px-3 py-1 rounded-full w-fit mb-3">
                <span className="text-sm font-medium text-purple-400">
                  SDG #11
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Urban Vertical Farming App
              </h3>
              <p className="text-gray-300 text-sm flex-grow">
                Mobile application to manage and optimize small-scale vertical
                farms in cities.
              </p>
              <Link
                href="/projects/vertical-farming"
                className="mt-4 text-purple-400 text-sm flex items-center"
              >
                View Project
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </div>
  );
}
