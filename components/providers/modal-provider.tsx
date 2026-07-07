"use client";

import { useEffect, useState } from "react";

import { SettingsModal } from "@/components/modals/settings-modal";
import { CoverImageModal } from "@/components/modals/cover-image-modal";
import { VersionHistoryModal } from "@/components/modals/version-history-modal";
import { ImportMarkdownModal } from "@/components/modals/import-markdown-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
      <VersionHistoryModal />
      <ImportMarkdownModal />
    </>
  );
};
