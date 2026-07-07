"use client";

import { LayoutTemplate } from "lucide-react";

import { TemplatePicker } from "@/components/template-picker";

const TemplatesPage = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="md:max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <LayoutTemplate className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Template gallery</h1>
            <p className="text-sm text-muted-foreground">
              Pick a layout for weekly planning, class notes, finance tracking, and more.
            </p>
          </div>
        </div>
        <TemplatePicker variant="full" />
      </div>
    </div>
  );
};

export default TemplatesPage;
