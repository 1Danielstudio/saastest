"use client";

import { Copy } from "lucide-react";
import { Button } from "./ui/button";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-0 top-0 h-full"
      onClick={handleCopy}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}
