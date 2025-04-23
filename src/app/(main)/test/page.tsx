import { Mailer } from "@/components/mailer";

export default function YourPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D14] via-[#111120] to-[#1A1A2E] pt-30 pb-10">
      <div className="flex flex-col justify-center items-center mb-10">
        <h1 className="text-4xl font-bold text-center mb-2">Contact Us</h1>
        <Mailer />
      </div>
    </div>
  );
}
