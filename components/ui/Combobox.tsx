import { Button } from "@/shadcn/ui/button";
import { UserRoundPlus } from "lucide-react";
import { IBM_Plex_Sans_Thai } from "next/font/google";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

export function CreatePatient() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="
          flex items-center justify-center
          gap-5
          w-40
          bg-[#05548D] text-white
          rounded-[9px]
          cursor-pointer
          shadow-[0_6px_16px_rgba(5,84,141,0.3)]
          text-md font-semibold
          hover:bg-[#05548D]
  "
        >
          สร้างบัญชี
          <UserRoundPlus className="h-10 w-10 " strokeWidth={3} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-medium">
            โรคทั้งหมด
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>โรคเบาหวาน</DropdownMenuItem>
          <DropdownMenuItem>โรคความดันโลหิตสูง</DropdownMenuItem>
          <DropdownMenuItem>วัณโรค</DropdownMenuItem>
          <DropdownMenuItem>วัคซีนเด็ก</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
