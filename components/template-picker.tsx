"use client";

import Link from "next/link";
import { FileText, PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  documentTemplates,
  featuredTemplates,
  getCategoryLabel,
  getTemplatesByCategory,
  PLACEHOLDER_TITLE,
  serializeTemplateContent,
  templateCategories,
  type DocumentTemplate,
} from "@/lib/templates";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface TemplatePickerProps {
  parentDocument?: Id<"documents">;
  variant?: "compact" | "full";
}

const TemplateCard = ({
  template,
  onSelect,
  compact = false,
}: {
  template: DocumentTemplate;
  onSelect: (template: DocumentTemplate) => void;
  compact?: boolean;
}) => (
  <button
    type="button"
    onClick={() => onSelect(template)}
    className={cn(
      "text-left rounded-lg border bg-background p-4 hover:bg-primary/5 hover:border-primary/30 transition w-full",
      compact && "p-3"
    )}
  >
    <div className="flex items-start gap-3">
      <span className={cn("text-2xl", compact && "text-xl")}>{template.icon}</span>
      <div className="space-y-1 min-w-0">
        <p className="font-medium">{template.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        {!compact && (
          <p className="text-xs text-muted-foreground/80 pt-1">
            {getCategoryLabel(template.category)}
          </p>
        )}
      </div>
    </div>
  </button>
);

export const TemplatePicker = ({
  parentDocument,
  variant = "full",
}: TemplatePickerProps) => {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const isCompact = variant === "compact";

  const createDocument = ({
    title,
    icon,
    content,
  }: {
    title: string;
    icon?: string;
    content?: string;
  }) => {
    const promise = create({
      title,
      icon,
      content,
      parentDocument,
    }).then((documentId) => router.push(`/documents/${documentId}`));

    toast.promise(promise, {
      loading: "Creating page...",
      success: "Page created!",
      error: "Failed to create page.",
    });
  };

  const onBlankCreate = () => {
    createDocument({ title: PLACEHOLDER_TITLE });
  };

  const onTemplateCreate = (template: DocumentTemplate) => {
    createDocument({
      title: template.title,
      icon: template.icon,
      content: serializeTemplateContent(template.content),
    });
  };

  const templatesToShow = isCompact ? featuredTemplates : documentTemplates;

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className={cn("font-semibold", isCompact ? "text-base" : "text-2xl")}>
            {isCompact ? "Popular templates" : "Templates"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isCompact
              ? "Start quickly with a ready-made layout."
              : "Browse layouts inspired by popular Notion templates for planning, school, and finance."}
          </p>
        </div>
        <Button onClick={onBlankCreate} variant="outline" size={isCompact ? "sm" : "default"}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Blank page
        </Button>
      </div>

      {isCompact ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templatesToShow.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onTemplateCreate}
                compact
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild variant="secondary">
              <Link href="/templates">Browse all templates</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          {templateCategories.map((category) => {
            const categoryTemplates = getTemplatesByCategory(category.id);

            if (categoryTemplates.length === 0) {
              return null;
            }

            return (
              <section key={category.id} className="space-y-3">
                <div>
                  <h4 className="text-lg font-semibold">{category.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={onTemplateCreate}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <section className="space-y-3">
            <div>
              <h4 className="text-lg font-semibold">Start from scratch</h4>
              <p className="text-sm text-muted-foreground">
                Prefer a blank canvas? Create an empty page instead.
              </p>
            </div>
            <button
              type="button"
              onClick={onBlankCreate}
              className="text-left rounded-lg border border-dashed bg-background p-4 hover:bg-primary/5 hover:border-primary/30 transition w-full sm:max-w-sm"
            >
              <div className="flex items-start gap-3">
                <FileText className="h-6 w-6 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Blank page</p>
                  <p className="text-sm text-muted-foreground">
                    Start empty and build your own structure.
                  </p>
                </div>
              </div>
            </button>
          </section>
        </>
      )}
    </div>
  );
};
