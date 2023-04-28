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
      <body className={cn(inter.className, "bg-slate-900")}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
