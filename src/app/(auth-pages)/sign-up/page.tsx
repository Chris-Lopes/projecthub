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
import { useState } from "react";
import { FormEvent } from "react";
import { redirect } from "next/navigation";

type ActionResponse = {
  error: boolean;
  message: string;
};

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [textResult, setTextResult] = useState("");
  const [isAutoFilling, setIsAutoFilling] = useState(false);

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
            setIsLoading(false);
            redirect("/sign-in");
          }
        }}
        className="flex flex-col min-w-64 max-w-md w-full p-6 rounded-lg bg-gray-800/50"
      >
        <h1 className="text-2xl font-medium mb-2 text-gray-100">Sign up</h1>
        <p className="text-sm text-gray-300 mb-6">
          Already have an account?{" "}
          <Link
            className="text-purple-400 hover:text-purple-300 font-medium underline"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-gray-200">
            Name {isAutoFilling && "(Auto-filling...)"}
          </Label>
          <Input
            name="name"
            placeholder="name"
            required
            className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
          />
          <Label htmlFor="email" className="text-gray-200">
            Email
          </Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
          />
          <Label htmlFor="password" className="text-gray-200">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
            className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
          />
          <Label htmlFor="role" className="text-gray-200">
            Role
          </Label>
          <select
            name="role"
            className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 ring-offset-gray-800 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              {/* {textResult && (
                <div className="relative w-full p-4 mb-4 bg-gray-700 rounded-md">
                  <pre className="text-sm text-gray-200 whitespace-pre-wrap">
                    {textResult}
                  </pre>
                </div>
              )} */}
              <Label htmlFor="id_card" className="text-gray-200">
                Id Card
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
                          'select[name="class"]'
                        ) as HTMLSelectElement;
                        const academicYearSelect = form.querySelector(
                          'select[name="academic_year"]'
                        ) as HTMLSelectElement;

                        if (nameInput && extractedData.name) {
                          nameInput.value = extractedData.name;
                        }
                        if (rollNoInput && extractedData.roll_no) {
                          rollNoInput.value = extractedData.roll_no;
                        }
                        if (classSelect && extractedData.branch) {
                          // Clean and normalize the branch name for better matching
                          const branchName = extractedData.branch
                            .toLowerCase()
                            .replace(/\s*-\s*/, " ") // normalize hyphens
                            .trim();

                          const options = Array.from(classSelect.options);
                          const bestMatch = options.find((opt) => {
                            const optionValue = opt.value.toLowerCase();
                            // Check for "Computer A" in "COMPUTERS - A"
                            if (branchName.includes("computer")) {
                              const division = branchName.slice(-1); // Get last character (A, B, C)
                              return (
                                optionValue ===
                                `computer ${division}`.toLowerCase()
                              );
                            }
                            return optionValue.includes(branchName);
                          });

                          if (bestMatch) {
                            classSelect.value = bestMatch.value;
                          }
                        }
                        if (academicYearSelect && extractedData.year) {
                          const currentDate = new Date();
                          const currentYear = currentDate.getFullYear();
                          const currentMonth = currentDate.getMonth() + 1;

                          // If we're in or after July, we're in the next academic year
                          const effectiveYear =
                            currentMonth >= 7 ? currentYear + 1 : currentYear;

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
                className="bg-gray-700 border-gray-600"
              />
              <Label htmlFor="roll_no" className="text-gray-200">
                Roll Number {isAutoFilling && "(Auto-filling...)"}
              </Label>
              <Input
                name="roll_no"
                placeholder="Roll Number"
                required
                readOnly
                disabled
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              />

              <Label htmlFor="class" className="text-gray-200">
                Class {isAutoFilling && "(Auto-filling...)"}
              </Label>
              <select
                name="class"
                className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 ring-offset-gray-800 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled
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

              <Label htmlFor="academic_year" className="text-gray-200">
                Academic Year {isAutoFilling && "(Auto-filling...)"}
              </Label>
              <select
                name="academic_year"
                disabled
                className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 ring-offset-gray-800 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

          {selectedRole === "faculty" && (
            <>
              <Label htmlFor="id_card" className="text-gray-200">
                Id Card
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
                          designationInput.value = extractedData.designation;
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
                className="bg-gray-700 border-gray-600"
              />
              <Label htmlFor="employee_no" className="text-gray-200">
                Employee Number {isAutoFilling && "(Auto-filling...)"}
              </Label>
              <Input
                name="employee_no"
                placeholder="Employee Number"
                required
                readOnly
                disabled
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              />

              <Label htmlFor="designation" className="text-gray-200">
                Designation {isAutoFilling && "(Auto-filling...)"}
              </Label>
              <Input
                name="designation"
                placeholder="Designation"
                required
                readOnly
                disabled
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              />

              <Label htmlFor="department" className="text-gray-200">
                Department {isAutoFilling && "(Auto-filling...)"}
              </Label>
              <Input
                name="department"
                placeholder="Department"
                required
                readOnly
                disabled
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              />
            </>
          )}

          <SubmitButton
            pendingText="Signing up..."
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white mt-4"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
