"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Star } from "lucide-react";

import { api } from "@/convex/_generated/api";
import Item from "./item";

export const FavoritesList = () => {
  const params = useParams();
  const router = useRouter();
  const favorites = useQuery(api.documents.getFavorites);

  if (favorites === undefined || favorites.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <p className="text-[11px] font-medium text-muted-foreground px-3 mb-1">
        Favorites
      </p>
      {favorites.map((document) => (
        <Item
          key={document._id}
          id={document._id}
          onClick={() => router.push(`/documents/${document._id}`)}
          label={document.title}
          icon={Star}
          documentIcon={document.icon}
          active={params.documentId === document._id}
          isFavorite={document.isFavorite}
        />
      ))}
    </div>
  );
};
