import Sidebar from "@/components/Sidebar";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClientProviders } from "@/providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GH Social",
  description: "Full-stack Edge App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientProviders>
        <body className={cn(inter.className, "bg-slate-900")}>
          <div className="max-w-7xl mx-auto flex flex-row">
            <Sidebar />
            <div className="md:w-3/4 w-full md:border-r md:border-slate-700 border-r-0">{children}</div>
          </div>
        </body>
      </ClientProviders>
    </html>
  );
}
