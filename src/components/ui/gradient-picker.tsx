import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ColorPicker } from './color-picker';

export interface GradientPickerProps {
  startColor: string;
  endColor: string;
  angle: number;
  onStartColorChange: (color: string) => void;
  onEndColorChange: (color: string) => void;
  onAngleChange: (angle: number) => void;
  className?: string;
}

export const GradientPicker: React.FC<GradientPickerProps> = ({
  startColor,
  endColor,
  angle,
  onStartColorChange,
  onEndColorChange,
  onAngleChange,
  className,
}) => {
  const [localAngle, setLocalAngle] = useState(angle);

  useEffect(() => {
    setLocalAngle(angle);
  }, [angle]);

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAngle = parseInt(e.target.value, 10);
    setLocalAngle(newAngle);
    onAngleChange(newAngle);
  };

  const gradientStyle = {
    background: `linear-gradient(${angle}deg, ${startColor}, ${endColor})`,
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        className="w-full h-16 mb-4 rounded-md shadow-sm" 
        style={gradientStyle}
      />
      <div className="grid grid-cols-2 gap-3">
        <ColorPicker
          label="Start Color"
          value={startColor}
          onChange={(e) => onStartColorChange(e.target.value)}
        />
        <ColorPicker
          label="End Color"
          value={endColor}
          onChange={(e) => onEndColorChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Angle: {localAngle}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={localAngle}
          onChange={handleAngleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
          <span>270°</span>
          <span>360°</span>
        </div>
      </div>
    </div>
  );
};

GradientPicker.displayName = 'GradientPicker';
