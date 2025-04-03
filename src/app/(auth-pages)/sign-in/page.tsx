import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex flex-col justify-center items-center px-4 py-10">
      {/* Decorative elements matching landing page */}
      <div className="fixed -top-64 -right-64 w-[30rem] h-[30rem] bg-teal-500/5 rounded-full blur-3xl" />
      <div className="fixed -bottom-64 -left-64 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to continue to ProjectHub</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-6">
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-slate-700/50 border-slate-600/50 focus:border-teal-500/50 focus:ring-teal-500/20 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
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
                className="bg-slate-700/50 border-slate-600/50 focus:border-teal-500/50 focus:ring-teal-500/20 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <SubmitButton
              pendingText="Signing in..."
              formAction={signInAction}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-1 focus:ring-offset-slate-900"
            >
              Sign in
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </div>

        <div className="mt-6 text-center text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link
            className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
            href="/sign-up"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
