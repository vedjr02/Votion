"use client";

import dynamic from "next/dynamic";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DocumentTemplate,
  getCategoryLabel,
  serializeTemplateContent,
} from "@/lib/templates";

const TemplatePreviewEditor = dynamic(
  () =>
    import("@/components/template-preview-editor").then(
      (mod) => mod.TemplatePreviewEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3 p-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ),
  }
);

interface TemplatePreviewDialogProps {
  template: DocumentTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseTemplate: (template: DocumentTemplate) => void;
}

export const TemplatePreviewDialog = ({
  template,
  open,
  onOpenChange,
  onUseTemplate,
}: TemplatePreviewDialogProps) => {
  if (!template) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-start gap-3 pr-8">
            <span className="text-3xl">{template.icon}</span>
            <div className="space-y-1 text-left">
              <DialogTitle>{template.title}</DialogTitle>
              <DialogDescription>{template.description}</DialogDescription>
              <p className="text-xs text-muted-foreground">
                {getCategoryLabel(template.category)} · Preview only
                {template.sourceUrl && (
                  <>
                    {" · "}
                    <a
                      href={template.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground"
                    >
                      Based on Notion template
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-muted/20 px-2 py-4 min-h-[420px]">
          <div className="mx-auto max-w-3xl rounded-lg border bg-background shadow-sm">
            <TemplatePreviewEditor content={template.content} />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0 sm:justify-between">
          <p className="text-xs text-muted-foreground hidden sm:block">
            Scroll to explore the full layout before adding it to your workspace.
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onUseTemplate(template);
                onOpenChange(false);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Use this template
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const serializeTemplateForEditor = (template: DocumentTemplate) =>
  serializeTemplateContent(template.content);
