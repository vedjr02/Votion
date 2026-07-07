"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";

import { TemplatePicker } from "@/components/template-picker";

const DocumentsPage = () => {
  const { user } = useUser();

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-10 overflow-y-auto">
      <div className="flex flex-col items-center space-y-4 mb-8">
        <Image
          src="/empty.png"
          height="220"
          width="220"
          alt="Empty"
          className="dark:hidden"
        />
        <Image
          src="/empty-dark.png"
          height="220"
          width="220"
          alt="Empty"
          className="hidden dark:block"
        />
        <h2 className="text-lg font-medium">
          Welcome to {user?.firstName}&apos;s Votion
        </h2>
      </div>
      <TemplatePicker variant="compact" />
    </div>
  );
};

export default DocumentsPage;
