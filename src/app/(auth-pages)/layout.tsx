export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full justify-center flex flex-col gap-12 items-center">
      {children}
    </div>
  );
}
