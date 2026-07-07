import JSZip from "jszip";

import { Id } from "@/convex/_generated/dataModel";
import { exportDocumentToHtml } from "@/lib/export-html";
import { exportDocumentToMarkdown } from "@/lib/export-markdown";
import { markdownToBlocks } from "@/lib/import-markdown";
import {
  csvToPageContent,
  parseCsvImport,
} from "@/lib/import-csv";
import { downloadBlobFile, sanitizePageFilename } from "@/lib/page-filename";

export const VOTION_EXPORT_VERSION = 1;

export type ExportPageRecord = {
  id: Id<"documents"> | string;
  parentId?: Id<"documents"> | string;
  title: string;
  icon?: string;
  coverImage?: string;
  content?: string;
  isFullWidth?: boolean;
  isSmallText?: boolean;
  updatedAt?: number;
};

export type ImportPageInput = {
  title: string;
  content?: string;
  icon?: string;
  coverImage?: string;
  isFullWidth?: boolean;
  isSmallText?: boolean;
  parentIndex?: number;
};

type VotionManifestPage = {
  exportKey: string;
  title: string;
  icon?: string;
  parentExportKey?: string;
  markdownPath: string;
  jsonPath: string;
  htmlPath?: string;
};

type VotionManifest = {
  version: number;
  exportedAt: string;
  rootExportKey: string;
  pages: VotionManifestPage[];
};

const sortManifestPages = (pages: VotionManifestPage[]) => {
  const byKey = new Map(pages.map((page) => [page.exportKey, page]));
  const sorted: VotionManifestPage[] = [];
  const visited = new Set<string>();

  const visit = (entry: VotionManifestPage) => {
    if (visited.has(entry.exportKey)) return;

    if (entry.parentExportKey) {
      const parent = byKey.get(entry.parentExportKey);
      if (parent) {
        visit(parent);
      }
    }

    visited.add(entry.exportKey);
    sorted.push(entry);
  };

  pages.forEach((entry) => visit(entry));
  return sorted;
};

const buildExportKeys = (pages: ExportPageRecord[]) => {
  const idToKey = new Map<string, string>();
  const used = new Set<string>();

  pages.forEach((page, index) => {
    const base = sanitizePageFilename(page.title);
    let key = base;
    let suffix = 2;

    while (used.has(key)) {
      key = `${base} (${suffix})`;
      suffix += 1;
    }

    used.add(key);
    idToKey.set(String(page.id), `${key}-${index}`);
  });

  return idToKey;
};

export const buildPagePackageZip = async (
  pages: ExportPageRecord[],
  packageName: string,
  rootId?: string
) => {
  if (pages.length === 0) {
    throw new Error("Nothing to export");
  }

  const zip = new JSZip();
  const exportKeys = buildExportKeys(pages);
  const rootPage =
    (rootId ? pages.find((page) => String(page.id) === rootId) : undefined) ??
    pages.find(
      (page) =>
        !page.parentId ||
        !pages.some((candidate) => String(candidate.id) === String(page.parentId))
    ) ??
    pages[0];
  const rootKey = exportKeys.get(String(rootPage.id));

  if (!rootKey) {
    throw new Error("Could not determine export root");
  }

  const manifestPages: VotionManifestPage[] = pages.map((page) => {
    const exportKey = exportKeys.get(String(page.id))!;
    const parentExportKey = page.parentId
      ? exportKeys.get(String(page.parentId))
      : undefined;
    const markdownPath = `pages/${exportKey}.md`;
    const jsonPath = `pages/${exportKey}.json`;
    const htmlPath = `pages/${exportKey}.html`;

    return {
      exportKey,
      title: page.title,
      icon: page.icon,
      parentExportKey,
      markdownPath,
      jsonPath,
      htmlPath,
    };
  });

  const manifest: VotionManifest = {
    version: VOTION_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    rootExportKey: rootKey,
    pages: manifestPages,
  };

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  pages.forEach((page, index) => {
    const entry = manifestPages[index];
    const markdown = exportDocumentToMarkdown(page.title, page.content);
    const html = exportDocumentToHtml(page.title, page.content);

    zip.file(entry.markdownPath, markdown);
    zip.file(entry.htmlPath!, html);
    zip.file(
      entry.jsonPath,
      JSON.stringify(
        {
          title: page.title,
          icon: page.icon,
          coverImage: page.coverImage,
          content: page.content,
          isFullWidth: page.isFullWidth ?? false,
          isSmallText: page.isSmallText ?? false,
        },
        null,
        2
      )
    );
  });

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlobFile(`${sanitizePageFilename(packageName)}.zip`, blob);
};

export const parseCsvPagesFromZip = async (file: File) => {
  const zip = await JSZip.loadAsync(file);
  const csvPaths = Object.keys(zip.files).filter(
    (path) => path.endsWith(".csv") && !zip.files[path].dir
  );

  if (csvPaths.length === 0) {
    return null;
  }

  const pages: ImportPageInput[] = [];

  for (const path of csvPaths.sort()) {
    const csvFile = zip.file(path);
    if (!csvFile) continue;

    const csvText = await csvFile.async("string");
    const fileName = path.split("/").pop() ?? "database.csv";
    const parsed = parseCsvImport(csvText, fileName);

    pages.push({
      title: parsed.title,
      icon: parsed.icon,
      content: parsed.content,
    });
  }

  if (pages.length === 0) {
    return null;
  }

  return {
    pages,
    rootIndex: 0,
  };
};

export const parsePagePackageZip = async (file: File) => {
  const zip = await JSZip.loadAsync(file);
  const manifestFile = zip.file("manifest.json");

  if (!manifestFile) {
    const csvPages = await parseCsvPagesFromZip(file);
    if (csvPages) {
      return csvPages;
    }

    throw new Error("Invalid import file: expected manifest.json or .csv files");
  }

  const manifest = JSON.parse(await manifestFile.async("string")) as VotionManifest;

  if (!manifest.pages?.length) {
    throw new Error("Invalid Votion export: no pages found");
  }

  const sortedEntries = sortManifestPages(manifest.pages);
  const keyToIndex = new Map<string, number>();
  sortedEntries.forEach((entry, index) => {
    keyToIndex.set(entry.exportKey, index);
  });

  const pages: ImportPageInput[] = [];

  for (const entry of sortedEntries) {
    const jsonFile = zip.file(entry.jsonPath);
    const markdownFile = zip.file(entry.markdownPath);

    let pagePayload: {
      title: string;
      icon?: string;
      coverImage?: string;
      content?: string;
      isFullWidth?: boolean;
      isSmallText?: boolean;
    } = { title: entry.title, icon: entry.icon };

    if (jsonFile) {
      pagePayload = {
        ...pagePayload,
        ...JSON.parse(await jsonFile.async("string")),
      };
    } else if (markdownFile) {
      const markdown = await markdownFile.async("string");
      pagePayload.content = JSON.stringify(markdownToBlocks(markdown), null, 2);
    }

    pages.push({
      title: pagePayload.title || entry.title,
      icon: pagePayload.icon ?? entry.icon,
      coverImage: pagePayload.coverImage,
      content: pagePayload.content,
      isFullWidth: pagePayload.isFullWidth,
      isSmallText: pagePayload.isSmallText,
      parentIndex: entry.parentExportKey
        ? keyToIndex.get(entry.parentExportKey)
        : undefined,
    });
  }

  const rootIndex = keyToIndex.get(manifest.rootExportKey) ?? 0;

  return {
    pages,
    rootIndex,
  };
};

export const parseMarkdownImport = (markdown: string, fallbackTitle = "Imported page") => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const titleMatch = lines.find((line) => line.startsWith("# "));
  const title = titleMatch?.slice(2).trim() || fallbackTitle;

  return {
    title,
    content: JSON.stringify(markdownToBlocks(markdown), null, 2),
  };
};

export const readTextFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
