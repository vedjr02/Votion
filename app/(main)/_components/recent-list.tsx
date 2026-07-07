"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Clock3 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import Item from "./item";

export const RecentList = () => {
  const params = useParams();
  const router = useRouter();
  const recent = useQuery(api.documents.getRecent, { limit: 5 });

  if (recent === undefined || recent.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <p className="text-[11px] font-medium text-muted-foreground px-3 mb-1">
        Recent
      </p>
      {recent.map((document) => (
        <Item
          key={document._id}
          id={document._id}
          onClick={() => router.push(`/documents/${document._id}`)}
          label={document.title}
          icon={Clock3}
          documentIcon={document.icon}
          active={params.documentId === document._id}
          isFavorite={document.isFavorite}
        />
      ))}
    </div>
  );
};
