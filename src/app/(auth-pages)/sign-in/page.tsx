import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="w-full max-w-sm mx-auto relative z-10 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400">Sign in to continue to ProjectHub</p>
      </div>

      <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6">
        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              required
              className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
            />
          </div>

          <SubmitButton
            pendingText="Signing in..."
            formAction={signInAction}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-1 focus:ring-offset-[#141428]"
          >
            Sign in
          </SubmitButton>

          <FormMessage message={searchParams} />
        </form>
      </div>

      <div className="mt-6 text-center text-gray-400 text-sm">
        Don't have an account?{" "}
        <Link
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          href="/sign-up"
        >
          Sign up
        </Link>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-400 transition-colors flex items-center justify-center gap-1"
        >
          <span>←</span> Back to home
        </Link>
      </div>
    </div>
  );
}
