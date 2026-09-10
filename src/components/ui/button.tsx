import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-600 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-rose-600",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-mint-500",
        outline:
          "border-2 border-pine-900 bg-transparent text-pine-900 hover:bg-pine-900 hover:text-white",
        ghost: "hover:bg-accent text-pine-900",
        link: "text-pine-900 underline underline-offset-4 decoration-rose-500 decoration-2 hover:text-rose-600",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-13 px-8 text-base",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
