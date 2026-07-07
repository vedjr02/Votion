"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { Check, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface PageCommentsProps {
  documentId: Id<"documents">;
  isLocked?: boolean;
}

const formatCommentDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const PageComments = ({ documentId, isLocked }: PageCommentsProps) => {
  const { user } = useUser();
  const [body, setBody] = useState("");

  const comments = useQuery(api.comments.list, { documentId });
  const create = useMutation(api.comments.create);
  const remove = useMutation(api.comments.remove);
  const toggleResolved = useMutation(api.comments.toggleResolved);

  const onSubmit = async () => {
    if (!body.trim() || isLocked) return;

    try {
      await create({ documentId, body });
      setBody("");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const onRemove = (commentId: Id<"comments">) => {
    const promise = remove({ id: commentId });

    toast.promise(promise, {
      loading: "Deleting comment...",
      success: "Comment deleted",
      error: "Failed to delete comment",
    });
  };

  const onToggleResolved = (commentId: Id<"comments">) => {
    toggleResolved({ id: commentId }).catch(() => {
      toast.error("Failed to update comment");
    });
  };

  return (
    <div className="mt-10 border-t pt-6 pl-[54px] print:hidden">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <MessageSquare className="h-4 w-4" />
        <span>Comments</span>
        {comments && comments.length > 0 && (
          <span className="text-xs">({comments.length})</span>
        )}
      </div>

      {!isLocked && (
        <div className="mb-5 flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "You"} />
            <AvatarFallback>
              {user?.firstName?.[0] ?? user?.fullName?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Add a comment..."
              className="min-h-[72px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  onSubmit();
                }
              }}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={onSubmit} disabled={!body.trim()}>
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      {comments === undefined && (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      )}

      {comments?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No comments yet. Start the conversation on this page.
        </p>
      )}

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div
            key={comment._id}
            className={cn(
              "flex gap-3 rounded-md border px-3 py-3",
              comment.isResolved && "opacity-70 bg-muted/20"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.userImageUrl} alt={comment.userName} />
              <AvatarFallback>{comment.userName[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{comment.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCommentDate(comment.createdAt)}
                    {comment.isResolved && " · Resolved"}
                  </p>
                </div>
                {comment.userId === user?.id && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => onToggleResolved(comment._id)}
                      aria-label="Resolve comment"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => onRemove(comment._id)}
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
