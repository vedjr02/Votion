"use client";

import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Star,
} from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageContextMenu } from "@/components/page-context-menu";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { PLACEHOLDER_TITLE } from "@/lib/templates";
import { usePageActions } from "@/hooks/use-page-actions";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  isFavorite?: boolean;
  isDragOver?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  icon: LucideIcon;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
  isFavorite,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: ItemProps) => {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const update = useMutation(api.documents.update);

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = create({ title: PLACEHOLDER_TITLE, parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${documentId}`);
      }
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const onToggleFavorite = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;

    const promise = update({
      id,
      isFavorite: !isFavorite,
    });

    toast.promise(promise, {
      loading: "Updating favorite...",
      success: isFavorite ? "Removed from favorites" : "Added to favorites",
      error: "Failed to update favorite.",
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.altKey && id) {
      event.preventDefault();
      event.stopPropagation();
      usePageActions.getState().openSidePeek(id);
      return;
    }

    onClick?.(event);
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={handleClick}
      role="button"
      draggable={!!id}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary",
        isDragOver && "bg-primary/10 ring-1 ring-primary/20"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-1">
          <div
            role="button"
            onClick={onToggleFavorite}
            className="opacity-0 group-hover:opacity-100 rounded-sm p-0.5 hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Star
              className={cn(
                "h-3.5 w-3.5",
                isFavorite
                  ? "fill-yellow-400 text-yellow-400 opacity-100"
                  : "text-muted-foreground"
              )}
            />
          </div>
          <PageContextMenu
            documentId={id}
            includeExtendedItems
            onArchived={() => router.push("/documents")}
            trigger={
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-0.5"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            }
          />
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-0.5"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
