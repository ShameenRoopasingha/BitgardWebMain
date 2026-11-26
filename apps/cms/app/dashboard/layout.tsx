import { redirect } from "next/navigation";
import { getCmsSession } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const admin = await getCmsSession();
  if (!admin) {
    redirect("/auth/login");
  }

  return <DashboardShell admin={admin}>{children}</DashboardShell>;
}
