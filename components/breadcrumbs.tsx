"use client";

import { useQuery } from "convex/react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  document: Doc<"documents">;
}

export const Breadcrumbs = ({ document }: BreadcrumbsProps) => {
  const router = useRouter();
  const ancestors = useQuery(api.documents.getAncestors, {
    documentId: document._id,
  });

  if (ancestors === undefined) {
    return null;
  }

  if (!Array.isArray(ancestors)) {
    return null;
  }

  const crumbs = [...ancestors, document];

  return (
    <div className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground px-12 pt-4">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <div key={crumb._id} className="flex items-center gap-1 min-w-0">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            <button
              type="button"
              disabled={isLast}
              onClick={() => router.push(`/documents/${crumb._id}`)}
              className={cn(
                "truncate max-w-[160px] hover:text-foreground transition",
                isLast && "text-foreground font-medium cursor-default"
              )}
            >
              {crumb.icon ? `${crumb.icon} ` : ""}
              {crumb.title}
            </button>
          </div>
        );
      })}
    </div>
  );
};
