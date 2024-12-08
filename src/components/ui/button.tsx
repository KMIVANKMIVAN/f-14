import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        bezel56:
          "bg-gradient-to-b from-micolor500 to-micolor600 text-white shadow-md hover:from-micolor500/90 hover:to-micolor600/90",
        bezel67:
          "bg-gradient-to-b from-micolor600 to-micolor700 text-white shadow-md hover:from-micolor600/90 hover:to-micolor700/90",
        bezel78:
          "bg-gradient-to-b from-micolor700 to-micolor800 text-white shadow-md hover:from-micolor700/90 hover:to-micolor800/90",
        flat5:
          "bg-micolor500 text-white shadow-sm hover:bg-micolor500/90",
        flat6:
          "bg-micolor600 text-white shadow-sm hover:bg-micolor600/90",
        flat7:
          "bg-micolor700 text-white shadow-sm hover:bg-micolor700/90",
        desabilitado:
          "bg-micolor100 text-micolor400 shadow-sm",
        outline5:
          "border border-micolor500 bg-transparent text-micolor500 shadow-sm hover:border-micolor500/90 hover:text-micolor500/90",
        outline6:
          "border border-micolor600 bg-transparent text-micolor600 shadow-sm hover:border-micolor600/90 hover:text-micolor600/90",
        outline7:
          "border border-micolor700 bg-transparent text-micolor700 shadow-sm hover:border-micolor700/90 hover:text-micolor700/90",
        outlineDisam:
          "border border-micolor200 bg-transparent text-micolor200 shadow-sm hover:border-micolor200/90 hover:text-micolor200/90",

        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },

      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
