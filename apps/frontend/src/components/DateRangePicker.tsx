import React from "react";

interface DateRangePickerProps {
  from: string | null;
  to: string | null;
  onFromChange: (date: string | null) => void;
  onToChange: (date: string | null) => void;
}

export const DateRangePicker = React.memo<DateRangePickerProps>(
  ({ from, to, onFromChange, onToChange }) => {
    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onFromChange(e.target.value || null);
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onToChange(e.target.value || null);
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <label htmlFor="date-from" className="text-sm font-medium text-muted-foreground mb-1">
            From
          </label>
          <input
            id="date-from"
            type="date"
            value={from || ""}
            onChange={handleFromChange}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            aria-label="Filter from date"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="date-to" className="text-sm font-medium text-muted-foreground mb-1">
            To
          </label>
          <input
            id="date-to"
            type="date"
            value={to || ""}
            onChange={handleToChange}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            aria-label="Filter to date"
          />
        </div>
      </div>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";
