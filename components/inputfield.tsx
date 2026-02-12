import React from "react";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";

interface InputFieldProps {
  id: string;
  name: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  disabledIconClick?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  rightAddon?: React.ReactNode;
  className?: string;
  subLabel?: string;
  readOnly?: boolean;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  pattern?: string;
  endAdornment?: React.ReactNode;
  containerClassName?: string;
  errorMessageClassName?: string;
  endAdornmentLabel?: string;
  disabled?: boolean;
}

export function InputField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  errorMessage,
  required = false,
  autoComplete = "off",
  icon,
  onIconClick,
  disabledIconClick = false,
  inputRef,
  rightAddon,
  className,
  subLabel,
  readOnly = false,
  inputMode,
  pattern,
  containerClassName,
  errorMessageClassName,
  endAdornmentLabel,
  disabled = false,
}: InputFieldProps) {
  let prClass = "";
  if (icon && rightAddon) {
    prClass = "pr-20";
  } else if (icon || rightAddon) {
    prClass = "pr-8";
  }

  const hasError = !!errorMessage;

  return (
    <div className={containerClassName}>
      <Label htmlFor={id} className={`text-muted-foreground text-sm font-medium ${required ? "required" : ""}`}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {subLabel && (
        <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
      )}
      <div className="pt-1 relative">
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`${prClass} w-full ${className || ""} ${hasError ? "border-red-500" : ""}`}
          ref={inputRef}
          readOnly={readOnly}
          inputMode={inputMode}
          pattern={pattern}
        />
        {endAdornmentLabel && (
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${
              hasError ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            {endAdornmentLabel}
          </span>
        )}
        {(icon || rightAddon) && (
          <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
            {rightAddon && (
              <div className="h-full flex items-center justify-center text-muted-foreground cursor-pointer">
                {rightAddon}
              </div>
            )}
            {icon && (
              <div
                className={`h-full flex items-center justify-center text-muted-foreground ${disabledIconClick ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                onClick={!disabledIconClick ? onIconClick : undefined}
              >
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
      {errorMessage && (
        <p
          className={`text-sm text-destructive mt-1 ${errorMessageClassName || ""}`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
