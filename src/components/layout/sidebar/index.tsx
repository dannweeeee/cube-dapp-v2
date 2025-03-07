"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "@/lib/constants";

import DashboardSidebarUser from "./user";

const DashboardSidebarHeader = () => {
  return (
    <SidebarHeader className="py-4">
      <div className="flex items-center justify-between px-4">
        <Link href="/home" className="flex items-center space-x-2">
          <Image
            src="/assets/svg/cube-blue.svg"
            alt="Cube Logo"
            width={32}
            height={32}
            className="transition-transform duration-300 hover:scale-110"
          />
          <span className="text-lg font-bold tracking-tight text-black bg-clip-text group-data-[collapsible=icon]:hidden">
            Cube
          </span>
        </Link>
      </div>
    </SidebarHeader>
  );
};

const DashboardSidebarFooter = () => {
  return (
    <SidebarFooter className="border-t border-border/30 pt-2">
      <DashboardSidebarUser />
    </SidebarFooter>
  );
};

export function DashboardSidebar() {
  const pathname = usePathname();

  const getIsActive = (itemSegment: string) => {
    if (itemSegment === "home") {
      return pathname === "/home";
    }
    if (itemSegment === "wallet") {
      return pathname === "/wallet";
    }
    if (itemSegment === "vaults") {
      return pathname === "/vaults";
    }
    if (itemSegment === "payliao") {
      return pathname === "/payliao";
    }
    if (itemSegment === "activity") {
      return pathname === "/activity";
    }
    return pathname.startsWith(`/${itemSegment}`);
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="hidden md:flex border-r border-border/30 bg-background/80 backdrop-blur-md"
    >
      <DashboardSidebarHeader />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = getIsActive(item.segment);
                return (
                  <SidebarMenuItem key={item.title} className="mb-3">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`relative rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-primary/15 text-primary font-medium shadow-sm"
                          : "hover:bg-muted/80 text-muted-foreground hover:text-foreground hover:shadow-sm"
                      }`}
                    >
                      <Link
                        href={item.url}
                        target={item.external ? "_blank" : undefined}
                        className="flex items-center w-full px-4 py-3 rounded-lg"
                      >
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className={`mr-4 ${
                            isActive ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.div>
                        <span
                          className={`font-medium ${
                            isActive ? "text-primary" : ""
                          }`}
                        >
                          {item.title}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-indicator"
                            className="absolute left-0 w-1.5 h-6 bg-primary rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <DashboardSidebarFooter />
    </Sidebar>
  );
}
