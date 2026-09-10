import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-lg border border-input bg-white px-3.5 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground",
        "focus-visible:border-mint-600 focus-visible:ring-2 focus-visible:ring-mint-500/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
