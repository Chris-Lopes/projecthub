import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col justify-center items-center gap-12">
      <form className="flex-1 flex flex-col w-full gap-2 min-w-64 max-w-sm p-6 rounded-lg bg-gray-800/50">
        <div>
          <h1 className="text-2xl font-medium text-gray-100">Reset Password</h1>
          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              className="text-purple-400 hover:text-purple-300 underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>
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
          <SubmitButton
            formAction={forgotPasswordAction}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
