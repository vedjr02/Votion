import { exportDocumentToHtml } from "@/lib/export-html";

export const exportDocumentToPdf = (title: string, content?: string) => {
  const html = exportDocumentToHtml(title, content);
  const printWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!printWindow) {
    throw new Error("Pop-up blocked. Allow pop-ups to export PDF.");
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};
