"use client";

import { menu, TMenu } from "@/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Menu = ({ className }: { className?: string; user?: any }) => {
  const pathname = usePathname();

  return (
    <div className={className}>
      <ul className="flex flex-col gap-y-6 lg:flex-row lg:gap-x-6 xl:gap-x-6">
        {menu?.map((item: TMenu) => (
          <li key={item.id}>
            <Link
              href={item.path}
              className={cn(
                "inline-flex py-1 text-base font-medium leading-[22px] text-c-heading duration-300 hover:text-p-900 lg:px-2",
                {
                  "text-primary": pathname === item.path,
                }
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
