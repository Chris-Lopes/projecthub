export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex flex-col justify-center items-center px-4">
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
