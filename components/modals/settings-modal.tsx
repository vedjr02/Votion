"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { WorkspaceTransferActions } from "@/components/workspace-transfer-actions";

const shortcuts = [
  { keys: "⌘ K", description: "Search pages" },
  { keys: "⌘ N", description: "Create a new page" },
  { keys: "⌘ ⇧ K", description: "Open templates" },
  { keys: "⌘ D", description: "Duplicate page" },
  { keys: "⌘ ⇧ R", description: "Rename page" },
  { keys: "⌘ ⇧ P", description: "Move page" },
  { keys: "⌘ ⇧ ↩", description: "Open page in new tab" },
  { keys: "⌥ Click", description: "Open page in side peek" },
  { keys: "⌘ P", description: "Print current page" },
  { keys: "/", description: "Open block menu in editor" },
];

export const SettingsModal = () => {
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <Label>Appearance</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                Customize how Votion looks on your device
              </span>
            </div>
            <ModeToggle />
          </div>
          <div className="space-y-3">
            <Label>Keyboard shortcuts</Label>
            <div className="space-y-2">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.keys}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <kbd className="rounded border bg-muted px-2 py-1 text-xs font-mono">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
          <WorkspaceTransferActions />
        </div>
      </DialogContent>
    </Dialog>
  );
};
