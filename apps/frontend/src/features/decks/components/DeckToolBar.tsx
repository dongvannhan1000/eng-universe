"use client";

import type React from "react";
import { SearchBar } from "../../../components/SearchBar";
import { Button } from "../../../components/ui/button";

interface DeckToolbarProps {
  searchQuery: string;
  selectedTags: string[];
  availableTags: string[];
  onSearchChange: (query: string) => void;
  onTagsChange: (tags: string[]) => void;
  onClearFilters: () => void;
}

export const DeckToolbar: React.FC<DeckToolbarProps> = ({
  searchQuery,
  selectedTags,
  availableTags,
  onSearchChange,
  onTagsChange,
  onClearFilters,
}) => {
  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search decks..." />
        </div>

        {availableTags.length > 0 && (
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Active filters:{" "}
            {[
              searchQuery && "search",
              selectedTags.length > 0 &&
                `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"}`,
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
};
