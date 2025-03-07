import { cookies } from "next/headers";

import { DashboardSidebar } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar />
      <main className="w-full">
        <SidebarTrigger className="absolute z-50 mt-2 md:hidden" />
        {children}
      </main>
    </SidebarProvider>
  );
}
