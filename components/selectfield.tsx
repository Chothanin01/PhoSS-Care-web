import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label?: string;
  subLabel?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  selectTriggerClassName?: string;
  containerClassName?: string;
  errorMessageClassName?: string;
  p?: boolean;
  isValueName?: boolean;
  dropdownMaxHeight?: string;
  enableSearch?: boolean;
  className?: string;
}

const SelectFieldComponent = ({
  id,
  name,
  label,
  subLabel,
  placeholder,
  options,
  value,
  onValueChange,
  errorMessage,
  required = false,
  disabled = false,
  readOnly = false,
  selectTriggerClassName,
  containerClassName,
  errorMessageClassName,
  p = false,
  isValueName = false,
  dropdownMaxHeight = "max-h-[350px]",
  enableSearch = false,
  className,
}: SelectFieldProps) => {
  const isNonInteractive = disabled || readOnly;
  const hasError = !!errorMessage;

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!enableSearch || !searchTerm.trim()) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, enableSearch]);

  return (
    <div className={containerClassName}>
      <div className="flex flex-col">
        {label && (
          <Label htmlFor={id} className={`text-muted-foreground text-sm font-medium ${required ? "required" : ""}`}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {subLabel && (
          <span className="text-gray-500 text-xs font-normal mt-1">
            {subLabel}
          </span>
        )}
      </div>
      <div className={cn(!p && "pt-1")}>
        <Select
          onValueChange={onValueChange}
          value={value}
          disabled={disabled}
        >
          <SelectTrigger
            id={id}
            name={name}
            className={cn(
              'w-full',
              selectTriggerClassName,
              className,
              readOnly && !disabled && 'pointer-events-none',
              hasError && 'border-red-500',
            )}
            aria-disabled={isNonInteractive}
            tabIndex={isNonInteractive ? -1 : 0}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={cn("relative max-h-[400px] ", dropdownMaxHeight, "overflow-y-auto")}>
            {enableSearch && (
              <div className="p-2 sticky top-0 bg-white z-10">
                <Input
                  type="text"
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSearchTerm(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-full"
                />
              </div>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={isValueName ? option.label : String(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    readOnly && !disabled ? 'pointer-events-none' : '',
                    option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  )}
                >
                  {option.label}
                </SelectItem>
              ))
            ) : (
              <div className="text-sm text-gray-400 p-2">Not found</div>
            )}
          </SelectContent>
        </Select>
      </div>
      {errorMessage && (
        <p className={cn("text-sm text-destructive mt-1", errorMessageClassName)}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export const SelectField = React.memo(SelectFieldComponent);