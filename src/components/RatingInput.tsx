import { useState } from "react";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export function RatingInput({ value, onChange, hasError, disabled }: RatingInputProps) {
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  return (
    <div 
      className="flex gap-2 mt-2"
      onMouseLeave={() => !disabled && setHoveredStar(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredStar || value);
        
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHoveredStar(star)}
            className={`w-12 h-12 rounded-md border flex items-center justify-center text-2xl transition-all ${!disabled ? 'hover:scale-110' : ''} ${
              isActive
                ? "border-yellow-400 bg-yellow-50 text-yellow-500"
                : hasError
                ? "border-red-500 bg-red-50 text-red-500"
                : "border-gray-200 bg-gray-50 text-gray-300 hover:border-yellow-200 hover:text-yellow-400"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
