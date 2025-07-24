"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Container from "../layout/Container";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-40 px-4 pt-[16px] duration-300 sm:backdrop-blur-sm lg:border-b lg:border-b-c-secondary lg:pt-0 xl:px-0",
          {
            "border-b-[#eaeaea] lg:border-b": isSticky,
          }
        )}
      >
        <Container
          className={cn(
            "absolute flex h-[72px] w-[calc(100vw-32px)] items-start justify-between gap-4 rounded-[12px] border border-[#F2F0EE] bg-white px-[16px] py-1 shadow-sm transition-all duration-300 sm:static sm:h-auto sm:w-full sm:bg-inherit lg:rounded-none lg:border-0 lg:bg-opacity-60 lg:px-0 lg:py-[21.5px] lg:shadow-none",
            {
              "absolute h-[calc(100vh-76px)] bg-opacity-90 backdrop-blur-lg sm:w-auto":
                open,
            }
          )}
        >
          <div className="flex w-full items-center justify-between">
            {/* Logo */}
            <div className="basis-[204px]">
              <Link href={"/"}>
                <X className="h-[62px] w-[126px] focus:outline-none lg:h-[48px] lg:w-[141px]" />
              </Link>
            </div>

            {/* Mobile Menu */}
            <div
              className={cn(
                "absolute left-4 right-4 top-[calc(72px+16px)] z-30 flex flex-col items-start rounded-lg transition-all duration-300 sm:hidden",
                open
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-4 opacity-0"
              )}
            >
              <Menu />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <Menu />
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden basis-[204px] justify-end lg:flex">
              <Link
                href="mailto:arafatshabbir8@gmail.com"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-[48px] w-[133px] rounded-full px-6 py-2 text-sm lg:px-9"
                )}
              >
                Contact Me
              </Link>
            </div>

            {/* CTA Button - Mobile */}
            <div
              className={cn(
                "absolute bottom-[calc(16px)] left-4 right-4 z-30 flex flex-col items-start rounded-lg bg-white transition-all duration-300 sm:hidden",
                open
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-4 opacity-0"
              )}
            >
              <Link
                href="mailto:arafatshabbir8@gmail.com"
                onClick={() => setOpen(!open)}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-[48px] w-[calc(100vw-64px)] rounded-full px-6 py-2 text-sm lg:px-9"
                )}
              >
                Contact Me
              </Link>
            </div>

            {/* Menu Toggle Icons */}
            <MenuIcon
              onClick={() => setOpen(!open)}
              className={cn(
                "absolute right-2 size-[32px] text-c-heading transition-all duration-300 sm:hidden",
                {
                  "invisible rotate-180 scale-0 opacity-0": open,
                  "visible rotate-0 scale-100 opacity-100": !open,
                }
              )}
            />
            <X
              onClick={() => setOpen(!open)}
              className={cn(
                "absolute right-4 size-6 stroke-c-icon-disabled text-c-heading transition-all duration-300 sm:hidden",
                {
                  "visible rotate-0 scale-100 opacity-100": open,
                  "invisible -rotate-180 scale-0 opacity-0": !open,
                }
              )}
            />
          </div>
        </Container>
      </nav>

      {/* 👇 Spacer to prevent content hiding behind sticky nav (especially on mobile) */}
      <div className="h-[72px] sm:hidden" />
    </>
  );
};

export default Navbar;
