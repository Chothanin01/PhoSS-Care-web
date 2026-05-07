"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import Cookies from "js-cookie";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Menu, X } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "รายชื่อผู้ป่วย", href: "/patient" },
    { name: "คำขออนุมัติ", href: "/approve" },
  ];

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/admin/logout`, {
        method: "GET",
        credentials: "include",
      });

      Cookies.remove("token");
      router.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <header
        className="
          fixed top-5 left-4 right-4 md:left-6 md:right-6 z-50 rounded-lg
          bg-white
          shadow-[0_10px_20px_rgba(5,84,141,0.15)]
          flex flex-col md:flex-row md:items-center md:justify-between
          md:h-20 md:px-8 px-5
          transition-all duration-300
        "
      >
        <div className="flex items-center justify-between h-16 md:h-auto md:flex-1">
          <div className="flex items-center gap-3">
            <Image
              src="/image/PhossLogo.png"
              alt="Phoss care Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-base md:text-xl lg:text-2xl font-bold text-Bamboo-100 whitespace-nowrap">
              โรงพยาบาลโพธิ์ศรีสุวรรณ
            </h1>
          </div>

          <nav className="hidden md:flex gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "relative text-base lg:text-lg font-semibold transition-colors duration-200",
                    isActive
                      ? "text-Bamboo-100"
                      : "text-gray-600 hover:text-Bamboo-100"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-Bamboo-100 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setIsLogoutOpen(true)}
            className="hidden md:block text-base lg:text-lg font-medium text-gray-600 hover:text-Bamboo-100 ml-auto"
          >
            ออกจากระบบ
          </button>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-gray-600 hover:text-Bamboo-100 p-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "px-2 py-2.5 rounded-md text-base font-semibold transition-colors duration-200",
                    isActive
                      ? "text-Bamboo-100 bg-blue-50"
                      : "text-gray-600 hover:text-Bamboo-100 hover:bg-gray-50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLogoutOpen(true);
              }}
              className="px-2 py-2.5 rounded-md text-base font-medium text-gray-600 hover:text-Bamboo-100 hover:bg-gray-50 text-left"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </header>

      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>ยืนยันการออกจากระบบ</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            คุณต้องการออกจากระบบใช่หรือไม่?
          </DialogDescription>

          <div className="flex gap-3 mt-4 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsLogoutOpen(false)}
            >
              ยกเลิก
            </Button>

            <Button
              className="flex-1 bg-Bamboo-100 text-white hover:bg-gray-200"
              onClick={async () => {
                await handleLogout()
                setIsLogoutOpen(false)
              }}
            >
              ออกจากระบบ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
