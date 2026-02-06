import { X } from "lucide-react";

type ClosableBadgeProps = {
  label: string
  onRemove: () => void
}

export function ClosableBadge({ label, onRemove }: ClosableBadgeProps) {
  return (
    <div className="
      inline-flex items-center gap-2 h-9
      rounded-md border-2 border-Bamboo-100
      bg-white px-3 py-1
      text-sm font-medium text-Bamboo-100
    ">
      <span>{label}</span>

      <button
        onClick={onRemove}
        className="
          flex h-5 w-5 items-center justify-center
          rounded-full bg-Bamboo-100
          text-white hover:bg-Bamboo-100
        "
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
