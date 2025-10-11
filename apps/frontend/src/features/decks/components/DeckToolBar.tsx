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
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search decks..." />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {availableTags.length > 0 && (
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
      )}
    </div>
  );
};
