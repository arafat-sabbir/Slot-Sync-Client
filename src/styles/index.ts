import { cn } from "@/lib/utils";

export const getInputClassNames = (className?: string) => {
  return cn(
    "placeholder:text-c-text-disabled flex h-11  items-center gap-2 self-stretch rounded-lg border border-c-stroke-gray bg-[#F9FAFB]  placeholder:text-sm placeholder:font-normal placeholder:leading-[24px] placeholder:tracking-[-0.32px] text-sm",
    className,
  );
};

export const getSelectTriggerClassName = (className?: string) => {
  return cn(
    "flex h-11 items-center gap-2 self-stretch rounded-lg  border border-c-stroke-gray bg-[#F9FAFB]  placeholder:font-normal placeholder:leading-[24px] placeholder:tracking-[-0.32px] text-sm placeholder:text-c-text-disabled text-c-text-disabled",
    className,
  );
};

export const getLabelClassNames = (className?: string) => {
  return cn(
    "text-c-heading font-medium text-sm font-medium leading-[24px] tracking-[-0.32px]",
    className,
  );
};
