"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { PLACEHOLDER_TITLE } from "@/lib/templates";

export const useKeyboardShortcuts = () => {
  const router = useRouter();
  const create = useMutation(api.documents.create);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;

      if (isMeta && event.key.toLowerCase() === "k" && event.shiftKey) {
        event.preventDefault();
        router.push("/templates");
        return;
      }

      if (isMeta && event.key.toLowerCase() === "n") {
        event.preventDefault();
        const promise = create({ title: PLACEHOLDER_TITLE }).then((documentId) =>
          router.push(`/documents/${documentId}`)
        );

        toast.promise(promise, {
          loading: "Creating a new page...",
          success: "New page created!",
          error: "Failed to create page.",
        });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [create, router]);
};
