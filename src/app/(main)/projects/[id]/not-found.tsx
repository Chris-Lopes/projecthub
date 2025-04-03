import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-30 pb-10">
      {/* Decorative elements matching landing page */}
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-teal-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-10">
          <div className="mb-2">
            <span className="inline-block text-teal-400 font-medium mb-3 bg-teal-500/10 px-3 py-1 rounded-full text-sm">
              Error 404
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Project Not Found
          </h1>

          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            The project you're looking for doesn't exist or has been removed.
          </p>

          <Link
            href="/projects"
            className="bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-md transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Browse Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
