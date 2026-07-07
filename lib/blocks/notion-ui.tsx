import { Fragment } from "react";

import { cn } from "@/lib/utils";
import type { NotionDatabaseData, NotionGalleryData, NotionTag } from "@/lib/notion-blocks/types";

const tagColors: Record<NotionTag["color"], string> = {
  gray: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
  pink: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  green: "bg-green-500/20 text-green-300 border-green-500/30",
  yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

export const NotionTabs = ({
  tabs,
  activeTab,
}: {
  tabs: string[];
  activeTab?: string;
}) => (
  <div className="notion-tabs">
    {tabs.map((tab) => (
      <button
        key={tab}
        type="button"
        className={cn("notion-tab", (activeTab ?? tabs[0]) === tab && "active")}
        contentEditable={false}
      >
        {tab}
      </button>
    ))}
  </div>
);

export const NotionTagPill = ({ tag }: { tag: NotionTag }) => (
  <span className={cn("notion-tag", tagColors[tag.color])}>{tag.label}</span>
);

const sumColumn = (data: NotionDatabaseData, groupIndex: number) => {
  if (!data.sumColumnId) return null;

  const group = data.groups[groupIndex];
  const total = group.rows.reduce((acc, row) => {
    const raw = row.cells[data.sumColumnId!]?.replace(/[^0-9.-]/g, "") ?? "0";
    return acc + (Number.parseFloat(raw) || 0);
  }, 0);

  return total.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

export const NotionDatabaseView = ({
  data,
  compact = false,
}: {
  data: NotionDatabaseData;
  compact?: boolean;
}) => (
  <div className={cn("notion-database", compact && "compact")}>
    <div className="notion-database-header">
      <div className="notion-database-title">
        {data.icon && <span className="notion-database-icon">{data.icon}</span>}
        <span>{data.title}</span>
      </div>
      <NotionTabs tabs={data.tabs} activeTab={data.activeTab} />
    </div>

    <div className="notion-database-table-wrap">
      <table className="notion-database-table">
        <thead>
          <tr>
            {data.columns.map((column) => (
              <th key={column.id}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.groups.map((group, groupIndex) => (
            <Fragment key={group.title}>
              <tr key={`${group.title}-header`} className="notion-group-row">
                <td colSpan={data.columns.length}>
                  <span className="notion-group-toggle">▾</span>
                  {group.title}
                  <span className="notion-group-count">{group.rows.length}</span>
                </td>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.id} className="notion-data-row">
                  {data.columns.map((column) => (
                    <td key={column.id}>
                      {row.tags?.[column.id] ? (
                        <NotionTagPill tag={row.tags[column.id]} />
                      ) : (
                        <span className="notion-cell-text">
                          {column.id === "source" && "📄 "}
                          {row.cells[column.id] ?? ""}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {data.sumColumnId && (
                <tr key={`${group.title}-sum`} className="notion-sum-row">
                  <td colSpan={data.columns.length - 1} className="notion-sum-label">
                    SUM
                  </td>
                  <td className="notion-sum-value">{sumColumn(data, groupIndex)}</td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const NotionGalleryView = ({ data }: { data: NotionGalleryData }) => (
  <div className="notion-gallery">
    <div className="notion-gallery-header">
      <div className="notion-database-title">
        {data.icon && <span className="notion-database-icon">{data.icon}</span>}
        <span>{data.title}</span>
      </div>
      <NotionTabs tabs={data.tabs} activeTab={data.activeTab} />
    </div>
    <div className="notion-gallery-grid">
      {data.items.map((item) => (
        <div key={item.id} className="notion-gallery-card">
          <div className="notion-gallery-card-header">
            {item.icon && (
              <span
                className="notion-gallery-card-icon"
                style={{ backgroundColor: item.iconColor ?? "#3b82f6" }}
              >
                {item.icon}
              </span>
            )}
            <span className="notion-gallery-card-title">{item.title}</span>
          </div>
          <div className="notion-gallery-card-body">
            {item.properties.map((property) => (
              <div key={property.label} className="notion-gallery-property">
                <span className="notion-gallery-property-label">
                  {property.label}
                </span>
                <span className="notion-gallery-property-value">
                  {property.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
