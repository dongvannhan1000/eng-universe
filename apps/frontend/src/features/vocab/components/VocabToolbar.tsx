import React from "react";
import { SearchBar } from "../../../components/SearchBar";
// import { TagMultiSelect } from "../../../components/TagMultiSelect";
import { DateRangePicker } from "../../../components/DateRangePicker";

interface VocabToolbarProps {
  searchQuery: string;
  selectedTags: string[];
  fromDate: string | null;
  toDate: string | null;
  onSearchChange: (query: string) => void;
  // onTagsChange: (tags: string[]) => void;
  onFromDateChange: (date: string | null) => void;
  onToDateChange: (date: string | null) => void;
  onClearFilters: () => void;
}

export const VocabToolbar = React.memo<VocabToolbarProps>(
  ({
    searchQuery,
    selectedTags,
    fromDate,
    toDate,
    onSearchChange,
    // onTagsChange,
    onFromDateChange,
    onToDateChange,
    onClearFilters,
  }) => {
    const hasActiveFilters = searchQuery || selectedTags.length > 0 || fromDate || toDate;

    return (
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search by word or explanation..."
            />
          </div>

          {/* <div>
            <TagMultiSelect selectedTags={selectedTags} onChange={onTagsChange} />
          </div> */}

          <div className="lg:col-span-1">
            <DateRangePicker
              from={fromDate}
              to={toDate}
              onFromChange={onFromDateChange}
              onToChange={onToDateChange}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Active filters:{" "}
              {[
                searchQuery && "search",
                selectedTags.length > 0 &&
                  `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"}`,
                (fromDate || toDate) && "date range",
              ]
                .filter(Boolean)
                .join(", ")}
            </div>
            <button
              onClick={onClearFilters}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    );
  },
);

VocabToolbar.displayName = "VocabToolbar";
