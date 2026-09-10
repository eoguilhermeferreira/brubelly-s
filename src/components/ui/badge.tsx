import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-pine-900 text-white border-transparent",
        rose: "bg-rose-500 text-white border-transparent",
        mint: "bg-mint-200 text-pine-900 border-transparent",
        gold: "bg-gold-400 text-pine-900 border-transparent",
        outline: "border-pine-900/30 text-pine-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
