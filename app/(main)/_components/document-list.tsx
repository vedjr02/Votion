"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
}

const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const reorder = useMutation(api.documents.reorderDocument);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [draggedId, setDraggedId] = useState<Id<"documents"> | null>(null);
  const [dragOverId, setDragOverId] = useState<Id<"documents"> | null>(null);

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const handleDrop = async (overId: Id<"documents">) => {
    if (!draggedId || draggedId === overId) return;

    try {
      await reorder({ activeId: draggedId, overId });
    } catch {
      toast.error("Failed to reorder page");
    } finally {
      setDraggedId(null);
      setDragOverId(null);
    }
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }
  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId == document._id}
            isFavorite={document.isFavorite}
            isDragOver={dragOverId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
            onDragStart={(event) => {
              setDraggedId(document._id);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", document._id);
            }}
            onDragEnd={() => {
              setDraggedId(null);
              setDragOverId(null);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setDragOverId(document._id);
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleDrop(document._id);
            }}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
