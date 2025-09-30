import React, { useState, useEffect, useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar = React.memo<SearchBarProps>(
  ({ value, onChange, placeholder = "Search vocabularies...", debounceMs = 300 }) => {
    const [localValue, setLocalValue] = useState(value);

    // Sync with external value changes
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Debounced onChange
    useEffect(() => {
      const timer = setTimeout(() => {
        if (localValue !== value) {
          onChange(localValue);
        }
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [localValue, onChange, value, debounceMs]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
    }, []);

    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          aria-label="Search vocabularies"
        />
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
