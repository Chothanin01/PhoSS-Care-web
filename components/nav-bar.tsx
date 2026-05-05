"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import Cookies from "js-cookie";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription  } from "@/shadcn/ui/dialog"
import { Button } from "@/shadcn/ui/button";

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const navItems = [
    { name: "รายชื่อผู้ป่วย", href: "/patient" },
    { name: "คำขออนุมัติ", href: "/approve" },
  ];

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/logout`, {
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
    <header
      className="
        fixed top-5 left-6 right-6 z-50 rounded-lg
        h-20 bg-white
        shadow-[0_10px_20px_rgba(5,84,141,0.15)]
        flex items-center justify-between px-8
      "
    >
      <div className="flex items-center">
        <Image
          src="/image/PhossLogo.png"
          alt="Phoss care Logo"
          width={40}
          height={40}
          className="rounded-full mr-4"
        />
        <h1 className="text-2xl font-bold text-Bamboo-100 whitespace-nowrap">
          โรงพยาบาลโพธิ์ศรีสุวรรณ
        </h1>
      </div>

      <nav className="absolute left-1/2 -translate-x-1/2 flex gap-12">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "relative text-lg font-semibold transition-colors duration-200",
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

      <div className="ml-auto">
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="text-lg font-medium text-gray-600 hover:text-Bamboo-100"
        >
          ออกจากระบบ
        </button>
      </div>

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
    </header>
  );
}
