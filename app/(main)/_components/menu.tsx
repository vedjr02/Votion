"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PageContextMenu } from "@/components/page-context-menu";
import { PageMenuExtendedItems } from "@/components/page-menu-extended-items";

interface MenuProps {
  document: Doc<"documents">;
}

export const Menu = ({ document }: MenuProps) => {
  const router = useRouter();

  const extendedContent = useMemo(
    () => (
      <>
        <DropdownMenuSeparator />
        <PageMenuExtendedItems document={document} />
      </>
    ),
    [document]
  );

  return (
    <PageContextMenu
      documentId={document._id}
      document={document}
      align="end"
      side="bottom"
      onArchived={() => router.push("/documents")}
      extraContent={extendedContent}
      trigger={
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      }
    />
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
