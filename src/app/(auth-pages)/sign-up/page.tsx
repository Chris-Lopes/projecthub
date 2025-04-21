"use client";
import {
  signUpAction,
  StudentIdCardExtraction,
  FacultyIdCardExtraction,
} from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type ActionResponse = {
  error: boolean;
  message: string;
};

export default function Signup() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [textResult, setTextResult] = useState("");
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full max-w-sm mx-auto relative z-10 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Create an account
        </h1>
        <p className="text-gray-400">
          Join ProjectHub to showcase your projects
        </p>
      </div>

      <div className="bg-[#141428]/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg p-6">
        <form
          onSubmit={async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            setIsLoading(true);
            setError(null);

            try {
              const result = (await signUpAction(formData)) as ActionResponse;
              if (!result.error) {
                form.reset();
                router.push("/sign-in");
              } else {
                setError(result.message);
              }
            } catch (error) {
              console.error(error);
              setError("An unexpected error occurred. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }}
          className="space-y-5"
        >
          {error && (
            <div className="p-4 rounded-md bg-red-900/20 border border-red-700/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Name{" "}
                {isAutoFilling && (
                  <span className="text-purple-400 text-xs ml-1">
                    (Auto-filling...)
                  </span>
                )}
              </Label>
              <Input
                name="name"
                id="name"
                placeholder="Your full name"
                required
                className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
              />
            </div>

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
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Choose a secure password"
                minLength={6}
                required
                className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-400">
                Must be at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">
                Role
              </Label>
              <select
                name="role"
                id="role"
                className="w-full rounded-md border border-purple-900/50 bg-[#1a1a30]/50 px-3 py-2 text-gray-200 focus:border-purple-500/50 focus:ring-purple-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141428]"
                required
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select your role</option>
                <option value="viewer">Viewer</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            {selectedRole === "student" && (
              <div className="mt-6 space-y-4 border-t border-purple-900/50 pt-5">
                <h3 className="text-gray-300 font-medium">
                  Student Information
                </h3>
                <p className="text-xs text-gray-400">
                  Upload your college ID card to auto-fill the details
                </p>

                <div className="space-y-2">
                  <Label htmlFor="id_card" className="text-gray-300">
                    College ID Card
                  </Label>
                  <Input
                    id="id_card"
                    name="id_card"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsAutoFilling(true);
                          const formData = new FormData();
                          formData.append("id_card", file);

                          const extractedData = await StudentIdCardExtraction(
                            formData
                          );
                          setTextResult(JSON.stringify(extractedData, null, 2));

                          // Auto-fill the form fields
                          const form = e.target.closest("form");
                          if (form) {
                            const nameInput = form.querySelector(
                              'input[name="name"]'
                            ) as HTMLInputElement;
                            const rollNoInput = form.querySelector(
                              'input[name="roll_no"]'
                            ) as HTMLInputElement;
                            const classSelect = form.querySelector(
                              'input[name="class"]'
                            ) as HTMLInputElement;
                            const academicYearSelect = form.querySelector(
                              'input[name="academic_year"]'
                            ) as HTMLInputElement;

                            if (nameInput && extractedData.name) {
                              nameInput.value = extractedData.name;
                            }
                            if (rollNoInput && extractedData.roll_no) {
                              rollNoInput.value = extractedData.roll_no;
                            }
                            if (classSelect && extractedData.branch) {
                              classSelect.value = extractedData.branch;
                            }
                            if (academicYearSelect && extractedData.year) {
                              const currentDate = new Date();
                              const currentYear = currentDate.getFullYear();
                              const currentMonth = currentDate.getMonth() + 1;

                              // If we're in or after July, we're in the next academic year
                              const effectiveYear =
                                currentMonth >= 7
                                  ? currentYear + 1
                                  : currentYear;

                              // For a 4-year course:
                              // If graduation is in 2027 and current effective year is 2024, they are in 1st year
                              // If graduation is in 2027 and current effective year is 2025, they are in 2nd year
                              // and so on...
                              const yearsUntilGraduation =
                                extractedData.year - effectiveYear;
                              const academicYear = Math.min(
                                Math.max(1, 4 - yearsUntilGraduation),
                                4
                              ).toString();

                              academicYearSelect.value = academicYear;
                            }
                          }
                        } catch (error) {
                          console.error("OCR Error:", error);
                          setTextResult(
                            "Failed to extract text from the image. Please try again or fill in the details manually."
                          );
                        } finally {
                          setIsAutoFilling(false);
                        }
                      }
                    }}
                    className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roll_no" className="text-gray-300">
                    Roll Number{" "}
                    {isAutoFilling && (
                      <span className="text-purple-400 text-xs ml-1">
                        (Auto-filling...)
                      </span>
                    )}
                  </Label>
                  <Input
                    name="roll_no"
                    id="roll_no"
                    placeholder="Roll Number"
                    required
                    readOnly
                    className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class" className="text-gray-300">
                    Class{" "}
                    {isAutoFilling && (
                      <span className="text-purple-400 text-xs ml-1">
                        (Auto-filling...)
                      </span>
                    )}
                  </Label>
                  <Input
                    name="class"
                    id="class"
                    placeholder="Class"
                    required
                    readOnly
                    className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academic_year" className="text-gray-300">
                    Academic Year{" "}
                    {isAutoFilling && (
                      <span className="text-purple-400 text-xs ml-1">
                        (Auto-filling...)
                      </span>
                    )}
                  </Label>
                  <Input
                    name="academic_year"
                    id="academic_year"
                    placeholder="Academic Year"
                    required
                    readOnly
                    className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
                  />
                </div>
              </div>
            )}

            {selectedRole === "faculty" && (
              <div className="mt-6 space-y-4 border-t border-purple-900/50 pt-5">
                <h3 className="text-gray-300 font-medium">
                  Faculty Information
                </h3>
                <p className="text-xs text-gray-400">
                  Upload your college ID card to auto-fill the details
                </p>

                <div className="space-y-2">
                  <Label htmlFor="id_card" className="text-gray-300">
                    College ID Card
                  </Label>
                  <Input
                    id="id_card"
                    name="id_card"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsAutoFilling(true);
                          const formData = new FormData();
                          formData.append("id_card", file);

                          const extractedData = await FacultyIdCardExtraction(
                            formData
                          );
                          setTextResult(JSON.stringify(extractedData, null, 2));

                          // Auto-fill the form fields
                          const form = e.target.closest("form");
                          if (form) {
                            const nameInput = form.querySelector(
                              'input[name="name"]'
                            ) as HTMLInputElement;
                            const employeeNoInput = form.querySelector(
                              'input[name="employee_no"]'
                            ) as HTMLInputElement;
                            const designationInput = form.querySelector(
                              'input[name="designation"]'
                            ) as HTMLInputElement;
                            const departmentInput = form.querySelector(
                              'input[name="department"]'
                            ) as HTMLInputElement;

                            if (nameInput && extractedData.name) {
                              nameInput.value = extractedData.name;
                            }
                            if (employeeNoInput && extractedData.employee_no) {
                              employeeNoInput.value =
                                extractedData.employee_no.toString();
                            }
                            if (designationInput && extractedData.designation) {
                              designationInput.value =
                                extractedData.designation;
                            }
                            if (departmentInput && extractedData.department) {
                              departmentInput.value = extractedData.department;
                            }
                          }
                        } catch (error) {
                          console.error("OCR Error:", error);
                          setTextResult(
                            "Failed to extract text from the image. Please try again or fill in the details manually."
                          );
                        } finally {
                          setIsAutoFilling(false);
                        }
                      }
                    }}
                    className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee_no" className="text-gray-300">
                    Employee Number{" "}
                    {isAutoFilling && (
                      <span className="text-purple-400 text-xs ml-1">
                        (Auto-filling...)
                      </span>
                    )}
                  </Label>
                  <Input
                    name="employee_no"
                    id="employee_no"
                    placeholder="Employee Number"
                    required
                    readOnly
                    className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-gray-300">
                    Designation{" "}
                    {isAutoFilling && (
                      <span className="text-purple-400 text-xs ml-1">
                        (Auto-filling...)
                      </span>
                    )}
                  </Label>
                  <Input
                    name="designation"
                    id="designation"
                    placeholder="Designation"
                    required
                    readOnly
                    className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-300">
                    Department{" "}
                    {isAutoFilling && (
                      <span className="text-purple-400 text-xs ml-1">
                        (Auto-filling...)
                      </span>
                    )}
                  </Label>
                  <Input
                    name="department"
                    id="department"
                    placeholder="Department"
                    required
                    readOnly
                    className="bg-[#1a1a30]/50 border-purple-900/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-gray-200 placeholder:text-gray-500"
                  />
                </div>
              </div>
            )}
          </div>

          <SubmitButton
            pendingText="Creating account..."
            disabled={isLoading}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-1 focus:ring-offset-[#141428] mt-6"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </SubmitButton>
        </form>
      </div>

      <div className="mt-6 text-center text-gray-400 text-sm">
        Already have an account?{" "}
        <Link
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          href="/sign-in"
        >
          Sign in
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
