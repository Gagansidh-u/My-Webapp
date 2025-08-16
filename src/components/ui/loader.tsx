"use client";

import { cn } from "@/lib/utils";

const loaderVariants = {
  container: "relative flex items-center justify-center",
  ring: "absolute h-full w-full rounded-full border-b-2 border-t-2",
  text: "text-lg font-bold font-headline",
};

interface LoaderProps {
  className?: string;
  ringClassName?: string;
  textClassName?: string;
  size?: number;
  text?: string;
}

export function Loader({
  className,
  ringClassName,
  textClassName,
  size = 48,
  text = "G",
}: LoaderProps) {
  return (
    <div
      className={cn(loaderVariants.container, className)}
      style={{ width: size, height: size }}
    >
      <div
        className={cn(
          loaderVariants.ring,
          "animate-spin border-primary/50",
          ringClassName
        )}
      />
      <span className={cn(loaderVariants.text, "text-primary", textClassName)}>
        {text}
      </span>
    </div>
  );
}
