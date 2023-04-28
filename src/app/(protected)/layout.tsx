import Sidebar from "@/components/Sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto flex flex-row">
      <Sidebar />
      <div className="md:w-3/4 w-full md:border-r md:border-slate-700 border-r-0  border-l border-slate-700">
        {children}
      </div>
    </div>
  );
}
