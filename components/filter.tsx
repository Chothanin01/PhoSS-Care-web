"use client";

import React, { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { Filter, X } from "lucide-react";
import { Separator } from "@/shadcn/ui/separator";
import { ClosableBadge } from "./filter-badge";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { cn } from "@/lib/utils";

export type PatientFilters = {
  diseases: string[];
  appointmentStatus?: "scheduled" | "none";
};

type Props = {
  diseaseOptions: string[];
  value: PatientFilters;
  onChange: (value: PatientFilters) => void;
};

const APPOINTMENT_OPTIONS = [
  { label: "มีใบนัดแพทย์", value: "scheduled" },
  { label: "ไม่มีใบนัดแพทย์", value: "none" },
];

export function PatientFilter({
  diseaseOptions,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              "mt-0.5 gap-2 font-medium h-9 rounded-md border px-3 py-1 shadow-xs transition-[color,box-shadow,border-color]",
              open
                ? "border-Bamboo-100 text-Bamboo-100 bg-white border-2"
                : "border-input text-gray-500 hover:bg-gray-200 bg-white"
            )}
          >
            <Filter className="h-4 w-4" />
            กรองข้อมูล
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="start"
          className="w-64 p-4 "
        >

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-md font-medium">
              <Filter className="h-5 w-5 text-black" />
              <span>กรองข้อมูล</span>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-sm p-1 hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <Separator />
          
            <div className="p-4 space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">โรค</p>
                {diseaseOptions.map((disease) => (
                  <div key={disease} className="flex items-center gap-2 mb-4">
                    <Checkbox
                      checked={value.diseases.includes(disease)}
                      onCheckedChange={(checked) => {
                        onChange({
                          ...value,
                          diseases: checked
                            ? [...value.diseases, disease]
                            : value.diseases.filter((d) => d !== disease),
                        });
                      }}
                    />
                    <span className="text-sm font-medium">{disease}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="p-4 space-y-4">
              <p className="mb-2 text-sm font-medium text-gray-400">ใบนัดแพทย์</p>

              <RadioGroup
                value={value.appointmentStatus}
                onValueChange={(val) =>
                  onChange({
                    ...value,
                    appointmentStatus: val as "scheduled" | "none",
                  })
                }
                className="space-y-3"
              >
                {APPOINTMENT_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <label
                      htmlFor={opt.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </DropdownMenuContent>
      </DropdownMenu>

      {value.diseases.map((d) => (
        <ClosableBadge
          key={d}
          label={d}
          onRemove={() =>
            onChange({
              ...value,
              diseases: value.diseases.filter((x) => x !== d),
            })
          }
        />
      ))}

      {value.appointmentStatus && (
        <ClosableBadge
          label={
            value.appointmentStatus === "scheduled"
              ? "มีใบนัดแพทย์"
              : "ไม่มีใบนัดแพทย์"
          }
          onRemove={() =>
            onChange({
              ...value,
              appointmentStatus: undefined,
            })
          }
        />
      )}
    </div>
  );
}
