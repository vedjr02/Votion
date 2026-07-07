"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

import { Spinner } from "@/components/spinner";
import { SearchCommand } from "@/components/search-command";
import { PageLinkPicker } from "@/components/page-link-picker";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { Navigation } from "./_components/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  useKeyboardShortcuts();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        <PageLinkPicker />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
