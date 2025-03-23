import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex justify-center items-center w-full">
      <form className="flex-1 flex flex-col w-full max-w-sm p-6 rounded-lg bg-gray-800/50">
        <h1 className="text-2xl font-medium text-gray-100">Sign in</h1>
        <p className="text-sm text-gray-300">
          Don't have an account?{" "}
          <Link
            className="text-purple-400 hover:text-purple-300 font-medium underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email" className="text-gray-200">
            Email
          </Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
          />
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-gray-200">
              Password
            </Label>
            <Link
              className="text-xs text-purple-400 hover:text-purple-300 underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
            className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
          />
          <SubmitButton
            pendingText="Signing In..."
            formAction={signInAction}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
