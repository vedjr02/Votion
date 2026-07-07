"use client";

import { Component, type ReactNode } from "react";

interface TemplatePreviewErrorBoundaryProps {
  children: ReactNode;
}

interface TemplatePreviewErrorBoundaryState {
  hasError: boolean;
}

export class TemplatePreviewErrorBoundary extends Component<
  TemplatePreviewErrorBoundaryProps,
  TemplatePreviewErrorBoundaryState
> {
  state: TemplatePreviewErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-sm text-muted-foreground">
          Preview could not load this layout. You can still use the template — it
          will open correctly in the editor.
        </div>
      );
    }

    return this.props.children;
  }
}
