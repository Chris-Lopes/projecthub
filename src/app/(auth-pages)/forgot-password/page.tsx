import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="w-full max-w-sm mx-auto relative z-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Reset your password
        </h1>
        <p className="text-slate-400">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg p-6">
        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              Email address
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

          <SubmitButton
            pendingText="Sending reset link..."
            formAction={forgotPasswordAction}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-1 focus:ring-offset-slate-900"
          >
            Send reset link
          </SubmitButton>

          <FormMessage message={searchParams} />
        </form>
      </div>

      <div className="mt-6 text-center text-slate-400 text-sm">
        Remember your password?{" "}
        <Link
          className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
          href="/sign-in"
        >
          Sign in
        </Link>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-400 transition-colors flex items-center justify-center gap-1"
        >
          <span>←</span> Back to home
        </Link>
      </div>
    </div>
  );
}
