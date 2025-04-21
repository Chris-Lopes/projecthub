import Link from "next/link";
import { Logo } from "@/components/logo";
import dynamic from "next/dynamic";
import { getUser } from "./actions";

const ProjectShowcase = dynamic(() => import("@/components/project-showcase"));
const FlipWords = dynamic(() => import("@/components/flip-words"));

export default async function LandingPage() {
  const currentYear = new Date().getFullYear();
  const user = await getUser();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] text-white">
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-violet-500/5 rounded-full blur-3xl" />

      <div className="fixed w-full px-4 sm:px-6 top-4 z-50">
        <header className="mx-auto max-w-5xl bg-[#141428]/30 backdrop-blur-md rounded-full border border-purple-900/30 shadow-lg shadow-black/20">
          <div className="px-4 sm:px-7 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center group">
              <Logo
                size="md"
                className="group-hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Desktop navigation */}
            {user ? (
              <nav className="flex items-center space-x-6">
                <Link
                  href="/sign-up"
                  className="group relative bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-md text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/30 font-semibold"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-700 to-purple-600"></div>
                </Link>
              </nav>
            ) : (
              <nav className="flex items-center space-x-6">
                <Link
                  href="/projects"
                  className="group relative bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-md text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/30 font-semibold"
                >
                  <span className="relative z-10">Explore</span>
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-700 to-purple-600"></div>
                </Link>
              </nav>
            )}
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="relative">
              <div className="inline-flex items-center bg-[#141428]/80 backdrop-blur-sm border border-purple-900/50 rounded-full px-3 py-1 text-sm text-purple-400 mb-6">
                <span className="flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute h-2 w-2 rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Platform for SDG-focused projects
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Showcase{" "}
                <FlipWords
                  words={["Innovation", "Solutions"]}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500"
                />
                That Matter
              </h1>

              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                A platform for students to share projects focused on sustainable
                development goals to make a positive impact.
              </p>

              <div className="flex flex-wrap gap-5">
                <Link
                  href="/projects"
                  className="group relative overflow-hidden bg-purple-700 px-6 py-3 rounded-md text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/30"
                >
                  <span className="relative z-10 flex items-center">
                    Explore Projects
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
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
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-700 to-violet-600 blur-sm"></div>
                </Link>
                {user && (
                  <Link
                    href="/sign-up"
                    className="group relative px-6 py-3 rounded-md text-white font-medium transition-colors duration-300 bg-[#141428]/80 hover:bg-[#1a1a30]/80 backdrop-blur-sm border border-purple-900/50 hover:border-purple-500/30"
                  >
                    <span className="relative z-10">Get Started</span>
                  </Link>
                )}
              </div>

              <div className="absolute top-5 left-0 -translate-x-36 translate-y-16 w-72 h-72 bg-purple-500/5 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            {/* Right side - Visual element */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#141428]/50 to-[#0D0D14]/50 backdrop-blur-sm rounded-2xl"></div>
              <div className="relative p-8">
                {/* 3D floating card effect */}
                <div className="relative w-full h-[400px] perspective-1000">
                  {/* Project card - floating in 3D space */}
                  <div className="absolute inset-0 transform rotate-y-3 rotate-x-6 shadow-xl rounded-xl border border-purple-900/50 bg-gradient-to-br from-[#141428]/90 to-[#0D0D14]/90 backdrop-blur-sm animate-float p-6 flex flex-col">
                    {/* Card header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-purple-500/10 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-purple-400">
                          SDG Goal #6
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#1A1A2E]/70 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Project title */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      Smart Water Monitoring System
                    </h3>

                    {/* Project description */}
                    <p className="text-gray-300 text-sm mb-6">
                      Using IoT devices to track water quality and consumption
                      in urban areas, helping communities reduce waste and
                      ensure access to clean water.
                    </p>

                    {/* Project stats */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">
                          Contributors
                        </span>
                        <span className="text-white font-medium">12</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">
                          Implemented
                        </span>
                        <span className="text-white font-medium">
                          3 locations
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Impact</span>
                        <span className="text-white font-medium">
                          6,500+ people
                        </span>
                      </div>
                    </div>

                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-2 py-1 text-xs rounded-md bg-[#1A1A2E]/60 text-gray-300">
                        Arduino
                      </span>
                      <span className="px-2 py-1 text-xs rounded-md bg-[#1A1A2E]/60 text-gray-300">
                        React
                      </span>
                      <span className="px-2 py-1 text-xs rounded-md bg-[#1A1A2E]/60 text-gray-300">
                        Python
                      </span>
                      <span className="px-2 py-1 text-xs rounded-md bg-[#1A1A2E]/60 text-gray-300">
                        IoT
                      </span>
                    </div>

                    {/* Bottom section with avatar */}
                    <div className="mt-auto pt-4 border-t border-purple-900/30 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-900/60 flex items-center justify-center text-purple-300 border border-purple-700/50">
                          TS
                        </div>
                        <span className="ml-2 text-sm text-gray-300">
                          Team Sustain
                        </span>
                      </div>
                      <div className="inline-flex items-center text-purple-400 text-sm">
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
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-7 -right-8 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-7 -left-8 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectShowcase />

      {/* Feature Highlights */}
      <section className="relative py-24 bg-[#141428]/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-purple-400 font-medium mb-3 bg-purple-500/10 px-3 py-1 rounded-full text-sm">
              Features
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose ProjectHub?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform provides everything you need to showcase your
              innovative ideas and connect with like-minded innovators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-[#141428]/50 p-6 rounded-xl shadow-lg border border-purple-900/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-900/5 hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:from-purple-400/30 group-hover:to-purple-600/30 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
                Showcase Your Work
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Share your projects with peers, educators, and potential
                collaborators. Build your portfolio and gain recognition for
                your innovation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-[#141428]/50 p-6 rounded-xl shadow-lg border border-purple-900/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-900/5 hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:from-purple-400/30 group-hover:to-purple-600/30 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
                Connect with Others
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Discover projects from other students and educators, leave
                comments, and engage with a community of innovative thinkers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-[#141428]/50 p-6 rounded-xl shadow-lg border border-purple-900/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-900/5 hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:from-purple-400/30 group-hover:to-purple-600/30 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.565A2.5 2.5 0 0017.5 1h-13A2.5 2.5 0 002 3.5V9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
                Support SDG Goals
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Align your projects with UN Sustainable Development Goals and
                make a positive impact on the world through technology and
                innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D14]/80 via-transparent to-[#0D0D14]/80"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-gradient-to-r from-[#141428]/90 to-[#0D0D14]/90 backdrop-blur-md rounded-2xl p-10 border border-purple-900/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left max-w-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to showcase your projects?
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Join our growing community of innovative creators and
                  contribute to sustainable development through technology and
                  creative solutions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {user && (
                  <Link
                    href="/sign-up"
                    className="group relative overflow-hidden bg-purple-700 hover:bg-purple-800 px-7 py-3 rounded-md text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/30 text-center whitespace-nowrap"
                  >
                    <span className="relative z-10">Create Account</span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-700 to-purple-600 blur-sm"></div>
                  </Link>
                )}
                <Link
                  href="/projects"
                  className="group px-7 py-3 rounded-md text-white font-medium transition-colors duration-300 bg-[#1A1A2E]/80 hover:bg-[#222240]/80 backdrop-blur-sm border border-purple-900/50 hover:border-purple-500/30 text-center whitespace-nowrap"
                >
                  <span className="relative z-10">Browse Projects</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D14]/80 backdrop-blur-sm py-16 border-t border-purple-900/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center group">
                <Logo
                  size="md"
                  className="group-hover:opacity-90 transition-opacity"
                />
              </Link>
              <p className="text-gray-400 text-sm mt-2 mb-5 max-w-xs">
                A platform for students to showcase innovation and build
                solutions for sustainable development.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/projects"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects/new"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Create Project
                  </Link>
                </li>
                <li>
                  <Link
                    href="/student"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Student Hub
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Account
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/sign-in"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forgot-password"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Reset Password
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-900/30 text-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} ProjectHub. All rights reserved. Building a
              sustainable future together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
