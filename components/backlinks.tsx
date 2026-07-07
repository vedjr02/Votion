"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowUpRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface BacklinksProps {
  documentId: Id<"documents">;
}

export const Backlinks = ({ documentId }: BacklinksProps) => {
  const backlinks = useQuery(api.documents.getBacklinks, { documentId });

  if (backlinks === undefined || backlinks.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 border-t pt-6 pl-[54px]">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <ArrowUpRight className="h-4 w-4" />
        <span>Backlinks</span>
      </div>
      <div className="space-y-1">
        {backlinks.map((document) => (
          <Link
            key={document._id}
            href={`/documents/${document._id}`}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60 transition"
          >
            {document.icon ? (
              <span className="text-base">{document.icon}</span>
            ) : (
              <span className="text-muted-foreground">📄</span>
            )}
            <span className="truncate">{document.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
