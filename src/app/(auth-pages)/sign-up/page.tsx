"use client";
import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { FormEvent } from "react";

type ActionResponse = {
  error: boolean;
  message: string;
};

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          setIsLoading(true);
          try {
            const result = (await signUpAction(formData)) as ActionResponse;
            if (!result.error) {
              form.reset();
            }
          } catch (error) {
            console.error(error);
          } finally {
            alert("Check your email for the verification link");
            setIsLoading(false);
          }
        }}
        className="flex flex-col min-w-64 max-w-md w-full p-6 rounded-lg shadow-sm"
      >
        <h1 className="text-2xl font-medium mb-2">Sign up</h1>
        <p className="text-sm text-foreground mb-6">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input name="name" placeholder="name" required />
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <Label htmlFor="role">Role</Label>
          <select
            name="role"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="viewer">Viewer</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          {selectedRole === "student" && (
            <>
              <Label htmlFor="roll_no">Roll Number</Label>
              <Input name="roll_no" placeholder="Roll Number" required />

              <Label htmlFor="class">Class</Label>
              <select
                name="class"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a class</option>
                <option value="Computer A">Computer A</option>
                <option value="Computer B">Computer B</option>
                <option value="Computer C">Computer C</option>
                <option value="Electronics and Computer Science">
                  Electronics and Computer Science
                </option>
                <option value="Mechanical">Mechanical</option>
                <option value="Artificial Intelligence and Data Science">
                  Artificial Intelligence and Data Science
                </option>
              </select>

              <Label htmlFor="academic_year">Academic Year</Label>
              <select
                name="academic_year"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </>
          )}

          <SubmitButton pendingText="Signing up..." disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
