"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface ProgressNavProps {
  children: ReactNode
  className?: string
  withChevron?: boolean
}

export function ProgressNav({ children, className, withChevron = false }: ProgressNavProps) {
  const childrenArray = Array.isArray(children) ? children : [children]

  return (
    <div className={cn("flex w-full flex-col gap-2 sm:flex-row sm:items-center", className)}>
      {childrenArray.map((child: any, index: number) => (
        <div key={index} className="flex w-full items-center justify-center min-w-0 p-2 sm:w-auto sm:flex-1">
          {child}
          {withChevron && index < childrenArray.length - 1 && (
            <ChevronRight
              className={cn(
                "h-5 w-5 mx-2",
                child.props?.isActive ? "text-Bamboo-100" : "text-gray-400"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
