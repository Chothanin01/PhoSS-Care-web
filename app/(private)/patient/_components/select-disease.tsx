"use client"

import { Checkbox } from "@/shadcn/ui/checkbox"
import { cn } from "@/lib/utils"

export type Disease = {
  disease_id: string
  name: string
}

interface DiseaseSelectorProps {
  options: Disease[]
  value: Disease[]
  onChange: (value: Disease[]) => void
  disabled?: boolean
}

export default function DiseaseSelector({
  options,
  value,
  onChange,
  disabled = false,
}: DiseaseSelectorProps) {
  const isSelected = (id: string) =>
    value.some((d) => d.disease_id === id)

  const toggleDisease = (checked: boolean, disease: Disease) => {
    if (disabled) return

    if (checked) {
      onChange([...value, disease])
    } else {
      onChange(value.filter((d) => d.disease_id !== disease.disease_id))
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-Bamboo-200 border-Bamboo-100/20 mb-6 w-fit">
      <div className="text-sm font-semibold mb-3">
        เลือกโรคที่ต้องการ<span className="text-red-500">*</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const checked = isSelected(option.disease_id)

          return (
            <label
              key={option.disease_id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-sm border transition-all duration-200 text-sm font-medium",
                "bg-gray-50 border-gray-300 text-gray-600",
                !disabled && "cursor-pointer hover:bg-gray-100",
                checked &&
                  "bg-white border-Bamboo-100/20 text-Bamboo-100"
              )}
            >
              <Checkbox
                disabled={disabled}
                checked={checked}
                onCheckedChange={(val) =>
                  toggleDisease(!!val, option)
                }
                className={cn(
                  checked &&
                    "data-[state=checked]:bg-Bamboo-100"
                )}
              />

              {option.name}
            </label>
          )
        })}
      </div>
    </div>
  )
}
