
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800",
        info:
          "border-transparent bg-blue-100 text-blue-800"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function BadgeWithAnimation(
  { className, variant, ...props }: BadgeProps
) {
  // Animation state
  const [animate, setAnimate] = React.useState(true);

  React.useEffect(() => {
    // Add animation class when component mounts
    const timeoutId = setTimeout(() => {
      setAnimate(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        animate && "animate-slide-in-right",
        className
      )}
      {...props}
    />
  );
}

export { BadgeWithAnimation, badgeVariants };
