"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--mint-50)",
          "--success-text": "var(--pine-900)",
          "--success-border": "var(--mint-400)",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
