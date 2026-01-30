import { UserRoundPlus } from "lucide-react";

export function CreateButton() {
  return (
    <button
      className="
        inline-flex items-center gap-3
        px-5 py-2
        rounded-md
        border-2 border-[#05548D]
        text-[#05548D]
        font-semibold text-xl
        bg-white
        hover:bg-[#05548D]
        hover:text-white
        transition
      "
    >
      สร้างบัญชี
      <UserRoundPlus className="w-6 h-6" />
    </button>
  );
}
