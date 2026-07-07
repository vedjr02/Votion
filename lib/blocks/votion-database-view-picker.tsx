"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import type { TableData, TableView } from "@/lib/blocks/votion-block-utils";
import {
  DATABASE_VIEW_OPTIONS,
  getDatabaseViewOption,
} from "@/lib/blocks/votion-database-view-options";

type DatabaseViewPickerProps = {
  data: TableData;
  onUpdate: (next: TableData) => void;
};

export const DatabaseViewPicker = ({ data, onUpdate }: DatabaseViewPickerProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const activeOption = getDatabaseViewOption(data.view);
  const ActiveIcon = activeOption.icon;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const applyView = (view: TableView) => {
    const option = getDatabaseViewOption(view);

    if (!option.implemented || option.disabled) {
      toast.message(`${option.label} is coming soon`);
      return;
    }

    const selectColumns = data.columns.filter((column) => column.type === "select");
    const dateColumn =
      data.columns.find((column) => column.name.toLowerCase() === "date") ??
      data.columns.find((column) => column.type === "date");

    onUpdate({
      ...data,
      view,
      showFilterPanel: false,
      showSortPanel: false,
      groupByColumnId:
        view === "board"
          ? (data.groupByColumnId ?? selectColumns[0]?.id ?? data.columns[0]?.id)
          : data.groupByColumnId,
      galleryCardColumnId:
        view === "gallery" || view === "feed"
          ? (data.galleryCardColumnId ?? dateColumn?.id ?? data.columns[0]?.id)
          : data.galleryCardColumnId,
      calendarDateColumnId:
        view === "calendar" || view === "timeline"
          ? (data.calendarDateColumnId ?? dateColumn?.id ?? data.columns[0]?.id)
          : data.calendarDateColumnId,
    });
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className={`votion-db-view-picker${open ? " open" : ""}`}
    >
      <button
        type="button"
        className="votion-db-view-trigger"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <ActiveIcon size={15} />
        <span>{activeOption.label.replace(" view", "")}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="votion-db-view-menu" role="menu">
          <p className="votion-db-view-menu-label">Database</p>

          <div className="votion-db-view-grid">
            {DATABASE_VIEW_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = data.view === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="menuitem"
                  className={[
                    "votion-db-view-option",
                    isActive ? "active" : "",
                    option.disabled ? "disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => applyView(option.id)}
                >
                  <Icon size={16} />
                  <span>{option.label}</span>
                  {option.isNew && <span className="votion-db-view-badge">New</span>}
                </button>
              );
            })}
          </div>

          <div className="votion-db-view-menu-footer">
            <button type="button" onClick={() => setOpen(false)}>
              Close menu
            </button>
            <span>esc</span>
          </div>
        </div>
      )}
    </div>
  );
};
