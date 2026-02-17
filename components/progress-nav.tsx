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
    <div className={cn("flex w-full items-center justify-between", className)}>
      {childrenArray.map((child: any, index: number) => (
        <div key={index} className="flex w-full items-center">
          <div className="flex-1 flex justify-center">
            {child}
          </div>
          {withChevron && index < childrenArray.length - 1 && (
            <div className="flex items-center justify-center px-4">
              <ChevronRight
                className={cn(
                  "h-5 w-5",
                  child.props?.isActive ? "text-Bamboo-100" : "text-gray-400"
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
