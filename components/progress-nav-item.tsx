"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface ProgressNavItemProps {
  icon: LucideIcon
  completedIcon?: LucideIcon
  label: string
  isActive?: boolean
  isCompleted?: boolean
  isDisabled?: boolean
  withMonoInactive?: boolean
  onClick?: () => void
  variant?: "tab" | "stepper"
}

export function ProgressNavItem({
  icon: Icon,
  completedIcon: CompletedIcon,
  label,
  isActive,
  isCompleted,
  isDisabled,
  withMonoInactive = false,
  onClick,
  variant = "tab",
}: ProgressNavItemProps) {
  const isDoneActive = isActive && label === "Done"
  const DisplayIcon = isCompleted && CompletedIcon ? CompletedIcon : Icon

  let wrapperClasses = "flex items-center space-x-2 p-1 rounded-sm cursor-pointer transition-colors duration-200 w-full"
  let iconBgClasses = "flex h-8 w-8 items-center justify-center rounded-sm"
  let iconTextClasses = ""
  let labelTextClasses = "text-sm font-medium font-semibold"

  // === STYLE CONFIGS ===
  const styles = {
    active: {
      wrapper: "bg-Bamboo-200",
      iconBg: "bg-Bamboo-100",
      iconText: "text-Bamboo-200",
      label: "text-Bamboo-100",
    },
    completed: {
      wrapper: "bg-[#D4EDCE]",
      iconBg: "bg-Bamboo-400",
      iconText: "text-Bamboo-200",
      label: "text-Bamboo-400",
    },
    doneActive: {
      iconBg: "bg-Bamboo-400",
      iconText: "text-white",
      label: "text-Bamboo-400",
    },
    inactive: {
      wrapper: "bg-transparent hover:bg-gray-50",
      iconBg: "bg-gray-200",
      iconText: "text-gray-600",
      label: "text-gray-600",
    },
  }

  // === STATE STYLES ===
  if (isDoneActive) {
    wrapperClasses = cn(wrapperClasses, styles.active.wrapper)
    iconBgClasses = cn(iconBgClasses, styles.doneActive.iconBg)
    iconTextClasses = styles.doneActive.iconText
    labelTextClasses = cn(labelTextClasses, styles.doneActive.label)
  } else if (isActive) {
    wrapperClasses = cn(wrapperClasses, styles.active.wrapper)
    iconBgClasses = cn(iconBgClasses, styles.active.iconBg)
    iconTextClasses = styles.active.iconText
    labelTextClasses = cn(labelTextClasses, styles.active.label)
  } else if (isCompleted) {
    wrapperClasses = cn(wrapperClasses, styles.completed.wrapper)
    iconBgClasses = cn(iconBgClasses, styles.completed.iconBg)
    iconTextClasses = styles.completed.iconText
    labelTextClasses = cn(labelTextClasses, styles.completed.label)
  } else if (withMonoInactive) {
    wrapperClasses = cn(wrapperClasses, styles.inactive.wrapper)
    iconBgClasses = cn(iconBgClasses, styles.inactive.iconBg)
    iconTextClasses = styles.inactive.iconText
    labelTextClasses = cn(labelTextClasses, styles.inactive.label)
  }

  if (isDisabled) {
    wrapperClasses = cn(wrapperClasses, "cursor-not-allowed opacity-50 select-none")
  }

  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={wrapperClasses}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      <div className={cn(iconBgClasses, iconTextClasses)}>
        <DisplayIcon className="h-5 w-5" />
      </div>

      <div className="flex flex-col">
        <span className={labelTextClasses}>{label}</span>
      </div>
    </div>
  )
}
