"use client";

import { useEffect, useMemo, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { api } from "@/convex/_generated/api";
import {
  getContentSnippet,
  getDocumentSearchValue,
} from "@/lib/search-documents";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState("");

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const filteredDocuments = useMemo(() => {
    if (!documents) return [];

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return documents;

    return documents.filter((document) =>
      getDocumentSearchValue(document).includes(normalizedQuery)
    );
  }, [documents, query]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
    setQuery("");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setQuery("");
        }
      }}
    >
      <CommandInput
        placeholder={`Search ${user?.fullName}'s Votion...`}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {filteredDocuments.map((document) => {
            const snippet = getContentSnippet(document.content, query);

            return (
              <CommandItem
                key={document._id}
                value={getDocumentSearchValue(document)}
                onSelect={() => onSelect(document._id)}
              >
                {document.icon ? (
                  <p className="mr-2 text-[18px]">{document.icon}</p>
                ) : (
                  <File className="mr-2 h-4 w-4 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="truncate">{document.title}</p>
                  {snippet && (
                    <p className="truncate text-xs text-muted-foreground">
                      {snippet}
                    </p>
                  )}
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
