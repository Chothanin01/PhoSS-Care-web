import { Button } from "@/components/shadcn/ui/kebub-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/kebub-dropdown";
import {
  FileText,
  Book,
  SquarePen,
  Trash2,
  EllipsisVertical,
} from "lucide-react";

export function KebubDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-auto w-auto p-0 hover:bg-transparent focus-visible:ring-0"
          aria-label="Open menu"
        >
          <EllipsisVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4} className="min-w-[160px]">
        <DropdownMenuItem>
          <SquarePen className="mr-2 h-4 w-4" />
          เเก้ไข
        </DropdownMenuItem>

        <DropdownMenuItem>
          <FileText className="mr-2 h-4 w-4" />
          เพิ่มใบนัด
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Book className="mr-2 h-4 w-4" />
          ดูข้อมูลทั้งหมด
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Trash2 className="mr-2 h-4 w-4" />
          ลบบัญชี
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
