import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ className, label, description, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value as string);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      setDisplayValue(e.target.value);
    };

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={props.id} 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div className="flex items-center gap-3">
          <div 
            className="relative flex-shrink-0 w-10 h-10 rounded-md overflow-hidden"
            style={{backgroundColor: value as string}}
          >
            <input
              type="color"
              className={cn(
                "opacity-0 absolute inset-0 h-full w-full cursor-pointer",
                className
              )}
              ref={ref}
              value={value as string}
              onChange={handleChange}
              {...props}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {displayValue?.toString().toUpperCase()}
            </span>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';
