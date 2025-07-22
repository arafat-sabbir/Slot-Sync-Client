import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "max-w-[calc(1280px_-_12px)] mx-auto px-7 lg:px-12 xl:px-16",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
