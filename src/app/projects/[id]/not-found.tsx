import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          Project Not Found
        </h1>
        <p className="text-gray-400 mb-8">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/projects"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition duration-200"
        >
          Browse Projects
        </Link>
      </div>
    </div>
  );
}
